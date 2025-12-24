import { Notification, Prisma } from "@prisma/client";

export interface INotificationRepository {
  create(tx: Prisma.TransactionClient, data: Prisma.NotificationCreateInput, ): Promise<Notification>;

  findUnreadByUser(userId: number): Promise<Notification[]>;

  findUnreadByEstablishment(establishmentId: number): Promise<Notification[]>;

  markAsRead(id: number): Promise<Notification>;
}
