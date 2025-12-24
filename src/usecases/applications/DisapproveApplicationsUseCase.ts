import prisma from "../../infrastructure/prismaClient";
import { IApplicationRepository } from "../../repositories/IApplicationRepository";
import { INotificationRepository } from "../../repositories/INotificationRepository";
import { ISseService } from "../../services/ISseService"; 
import { AppError } from "../../utils/AppError";

interface DisapproveApplicationRequest {
  establishmentId: number;
  applicationId: number;
}

export class DisapproveApplicationUseCase {
  constructor(
    private applicationRepository: IApplicationRepository,
    private notificationRepository: INotificationRepository,
    private sseService: ISseService
  ) {}

  async execute({
    establishmentId,
    applicationId
  }: DisapproveApplicationRequest) {
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
      "disapproved"
    );
    const notification = await prisma.$transaction(async (tx) => {
      const notification = await this.notificationRepository.create(tx,{
        user: { connect: { id: application.userId } },
        type: "application_disapproved",
        payload: {
          applicationId,
          jobId: application.jobId
        }
      });
      return notification
    }
  )

    

    this.sseService.emitToUser(application.userId, {
      type: notification.type,
      payload: notification.payload
    });

    return updated;
  }
}
