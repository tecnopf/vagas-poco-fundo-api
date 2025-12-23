import { PrismaClient, Notification, Prisma } from "@prisma/client";
import { INotificationRepository } from "../repositories/INotificationRepository";

const prisma = new PrismaClient();

export class PrismaNotificationRepository implements INotificationRepository {
  async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async findUnreadByUser(userId: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: {
        userId,
        readAt: null
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async findUnreadByEstablishment(
    establishmentId: number
  ): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: {
        establishmentId,
        readAt: null
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async markAsRead(id: number): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { readAt: new Date() }
    });
  }
}
