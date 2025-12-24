import { IApplicationRepository } from "../../repositories/IApplicationRepository";
import { IVacancyRepository } from "../../repositories/IVacancyRepository"; 
import { INotificationRepository } from "../../repositories/INotificationRepository";
import { AppError } from "../../utils/AppError";
import { ISseService } from "../../services/ISseService";
import { Job } from "@prisma/client";
import prisma from "../../infrastructure/prismaClient";
import { IResumeStorageService } from "../../services/IResumeStorageService";

interface ApplyToJobRequest {
  userId: number;
  job: Job;
  resumeUrl?: string;
}

export class ApplyToJobUseCase {
  constructor(
    private vacancyRepository: IVacancyRepository,
    private notificationRepository: INotificationRepository,
    private sseService: ISseService,
    private resumeStorageService: IResumeStorageService
  ) {}

  async execute({ userId, job, resumeUrl }: ApplyToJobRequest) {
    let uploadedResumeUrl: string | undefined;

    try {
      uploadedResumeUrl = resumeUrl;

      const application = await prisma.$transaction(async (tx) => {
        const app =
          await this.vacancyRepository.applyToJobTransactional({
            tx,
            userId,
            job,
            resumeUrl
          });

        await this.notificationRepository.create(tx, {
          establishment: { connect: { id: job.establishmentId } },
          type: "application_created",
          payload: {
            applicationId: app.id,
            jobId: job.id,
            userId
          }
        });

        return app;
      });

      this.sseService.emitToEstablishment(job.establishmentId, {
        type: "application_created",
        payload: { applicationId: application.id }
      });

      return application;
    } catch (error) {
      if (uploadedResumeUrl) {
        await this.resumeStorageService.delete(uploadedResumeUrl).catch(() => {});
      }
      throw error;
    }
  }



}
