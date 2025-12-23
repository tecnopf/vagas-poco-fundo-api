import { IApplicationRepository } from "../../repositories/IApplicationRepository";
import { IVacancyRepository } from "../../repositories/IVacancyRepository"; 
import { INotificationRepository } from "../../repositories/INotificationRepository";
import { AppError } from "../../utils/AppError";
import { ISseService } from "../../services/ISseService";

interface ApplyToJobRequest {
  userId: number;
  jobId: number;
  resumeUrl?: string;
}

export class ApplyToJobUseCase {
  constructor(
    private applicationRepository: IApplicationRepository,
    private vacancyRepository: IVacancyRepository,
    private notificationRepository: INotificationRepository,
    private sseService: ISseService
  ) {}

  async execute({
    userId,
    jobId,
    resumeUrl
  }: ApplyToJobRequest) {
    const job = await this.vacancyRepository.findById(jobId);
    if (!job) throw new AppError("Job not found", 404);

    const alreadyApplied =
      await this.applicationRepository.findByUserAndJob(userId, jobId);
    if (alreadyApplied) {
      throw new AppError("User already applied to this job", 409);
    }

    const application = await this.applicationRepository.create({
      user: { connect: { id: userId } },
      job: { connect: { id: jobId } },
      establishment: { connect: { id: job.establishmentId } },
      resumeUrl,
      status: "pending"
    });

    await this.notificationRepository.create({
      establishment: { connect: { id: job.establishmentId } },
      type: "application_created",
      payload: {
        applicationId: application.id,
        jobId: job.id,
        userId
      }
    });

    this.sseService.emitToEstablishment(job.establishmentId, {
      type: "application_created",
      payload: {
          applicationId: application.id
      }
    });

    return application;
  }
}
