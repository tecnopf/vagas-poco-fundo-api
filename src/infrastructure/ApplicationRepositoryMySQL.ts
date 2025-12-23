import { Application, ApplicationStatus, Prisma } from "@prisma/client";
import { IApplicationRepository } from "../repositories/IApplicationRepository";
import prisma from "./prismaClient";


export class PrismaApplicationRepository implements IApplicationRepository {
  async create(data: Prisma.ApplicationCreateInput): Promise<Application> {
    return prisma.application.create({ data });
  }

  async findById(id: number): Promise<Application | null> {
    return prisma.application.findUnique({
      where: { id },
      include: { user: true, job: true, establishment: true }
    });
  }

  async findByUserAndJob(userId: number, jobId: number): Promise<Application | null> {
    return prisma.application.findFirst({
      where: {
        userId,
        jobId
      }
    });
  }

  async findByUser(userId: number): Promise<Application[]> {
    return prisma.application.findMany({
      where: { userId },
      include: { job: true, establishment: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async findByEstablishment(establishmentId: number): Promise<Application[]> {
    return prisma.application.findMany({
      where: { establishmentId },
      include: { user: true, job: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async update(id: number, data: Prisma.ApplicationUpdateInput): Promise<Application> {
    return prisma.application.update({
      where: { id },
      data
    });
  }

  async updateStatus(
    id: number,
    status: ApplicationStatus,
    interviewData?: {
      interviewAddress?: string;
      interviewPhone?: string;
      interviewEmail?: string;
      interviewDateTime?: Date;
    }
  ): Promise<Application> {
    return prisma.application.update({
      where: { id },
      data: {
        status,
        ...(status === "approved" && interviewData
          ? {
              interviewAddress: interviewData.interviewAddress,
              interviewPhone: interviewData.interviewPhone,
              interviewEmail: interviewData.interviewEmail,
              interviewDateTime: interviewData.interviewDateTime
            }
          : {})
      }
    });
  }
}
