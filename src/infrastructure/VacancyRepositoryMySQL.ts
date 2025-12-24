import { JsonValue } from "@prisma/client/runtime/library";
import { Job, Prisma, PrismaClient } from "@prisma/client";
import { IVacancyRepository } from "../repositories/IVacancyRepository";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export type JobWithEstablishment = Job & {
  establishment: {
    id: number;
    name: string;
    socialLinks: JsonValue;
  };
};


export class PrismaVacancyRepository implements IVacancyRepository {
  async create(data: Prisma.JobCreateInput): Promise<Job> {
    return prisma.job.create({ data });
  }

  async findAll(page = 0, pageSize = 30): Promise<{
    jobs: JobWithEstablishment[];
    hasMore: boolean;
  }> {
    const nowUTC = new Date();
    const nowPlus3 = new Date(nowUTC.getTime() + 3 * 60 * 60 * 1000);

    await prisma.job.updateMany({
      where: {
        expiration: { lt: nowPlus3 },
        status: "opened",
      },
      data: { status: "expired" },
    });

    const jobs = await prisma.job.findMany({
      skip: page * pageSize,
      take: pageSize,
      include: {
        establishment: {
          select: { id: true, name: true, socialLinks: true },
        },
      },
      orderBy: { createdDate: "desc" }, 
    });

    const totalCount = await prisma.job.count();
    const hasMore = (page + 1) * pageSize < totalCount;

    return { jobs, hasMore };
  }

  async findByEstablishment(establishmentId: number): Promise<Job[]> {
    return prisma.job.findMany({
      where: { establishmentId },
    });
  }

  async applyToJobTransactional({
    tx,
    userId,
    job,
    resumeUrl
  }: {
    tx: Prisma.TransactionClient;
    userId: number;
    job: Job;
    resumeUrl?: string;
  }) {
    const updatedJob = await tx.job.updateMany({
      where: {
        id: job.id,
        remainingVacancies: { gt: 0 }
      },
      data: {
        remainingVacancies: { decrement: 1 }
      }
    });

    if (updatedJob.count === 0) {
      throw new AppError("INSUFFICIENT_VACANCIES", 409);
    }

    const application = await tx.application.create({
      data: {
        user: { connect: { id: userId } },
        job: { connect: { id: job.id } },
        establishment: { connect: { id: job.establishmentId } },
        resumeUrl,
        status: "pending"
      }
    });

    return application;
  }



  async findById(id: number): Promise<Job | null> {
    return prisma.job.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.JobUpdateInput): Promise<Job> {
    console.log(JSON.stringify(data))
    return prisma.job.update({ where: { id }, data: {...data, createdDate: new Date()} });
  }

  async delete(id: number): Promise<Job> {
    return prisma.job.delete({ where: { id } });
  }
}
