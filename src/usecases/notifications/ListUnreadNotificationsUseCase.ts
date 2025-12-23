import { INotificationRepository } from "../../repositories/INotificationRepository";

export class ListUnreadNotificationsUseCase {
  constructor(
    private notificationRepository: INotificationRepository
  ) {}

  async forUser(userId: number) {
    return this.notificationRepository.findUnreadByUser(userId);
  }

  async forEstablishment(establishmentId: number) {
    return this.notificationRepository.findUnreadByEstablishment(establishmentId);
  }
}
