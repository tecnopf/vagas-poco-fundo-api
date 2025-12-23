import { Application, ApplicationStatus, Prisma } from "@prisma/client";

export interface IApplicationRepository {
  create(data: Prisma.ApplicationCreateInput): Promise<Application>;

  findById(id: number): Promise<Application | null>;

  findByUserAndJob(userId: number, jobId: number): Promise<Application | null>;

  findByUser(userId: number): Promise<Application[]>;

  findByEstablishment(establishmentId: number): Promise<Application[]>;

  update(id: number, data: Prisma.ApplicationUpdateInput): Promise<Application>;

  updateStatus(
    id: number,
    status: ApplicationStatus,
    interviewData?: {
      interviewAddress?: string;
      interviewPhone?: string;
      interviewEmail?: string;
      interviewDateTime?: Date;
    }
  ): Promise<Application>;
}
