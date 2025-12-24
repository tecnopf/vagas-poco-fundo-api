import prisma from "../../infrastructure/prismaClient";
import { IApplicationRepository } from "../../repositories/IApplicationRepository";
import { INotificationRepository } from "../../repositories/INotificationRepository";
import { ISseService } from "../../services/ISseService";
import { AppError } from "../../utils/AppError";

interface ApproveApplicationRequest {
  establishmentId: number;
  applicationId: number;
  interviewAddress?: string;
  interviewPhone?: string;
  interviewEmail?: string;
  interviewDateTime?: Date;
}

export class ApproveApplicationUseCase {
  constructor(
    private applicationRepository: IApplicationRepository,
    private notificationRepository: INotificationRepository,
    private sseService: ISseService
  ) {}

  async execute({
    establishmentId,
    applicationId,
    interviewAddress,
    interviewPhone,
    interviewEmail,
    interviewDateTime
  }: ApproveApplicationRequest) {
    const application = await this.applicationRepository.findById(applicationId);
    if (!application) throw new AppError("Application not found", 404);

    if (application.establishmentId !== establishmentId) {
      throw new AppError("Unauthorized", 403);
    }

    if (application.status !== "pending") {
      throw new AppError("Application already processed", 409);
    }

    const updated = await this.applicationRepository.updateStatus(
      applicationId,
      "approved",
      {
        interviewAddress,
        interviewPhone,
        interviewEmail,
        interviewDateTime
      }
    );

    const notification = await prisma.$transaction(async (tx) => {
      const notification = await this.notificationRepository.create(tx,{
        user: { connect: { id: application.userId } },
        type: "application_approved",
        payload: {
          applicationId,
          jobId: application.jobId,
          interview: {
            interviewAddress,
            interviewPhone,
            interviewEmail,
            interviewDateTime
          }
        }
        
      });
      return notification

    })


    this.sseService.emitToUser(application.userId, {
      type: notification.type,
      payload: notification.payload
    });

    return updated;
  }
}
