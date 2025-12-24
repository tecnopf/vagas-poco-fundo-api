import { Application, Job, Prisma } from "@prisma/client"; 

export interface ApplyToJobTransactionalParams {
  tx: Prisma.TransactionClient;
  userId: number;
  job: Job;
  resumeUrl?: string;
  
}

export interface IVacancyRepository {
  create(data: Prisma.JobCreateInput): Promise<Job>;
  findAll(page?: number, pageSize?: number): Promise<{ jobs: Job[]; hasMore: boolean }>;
  findById(id: number): Promise<Job | null>;
  update(id: number, data: Prisma.JobUpdateInput): Promise<Job>;
  applyToJobTransactional(
    params: ApplyToJobTransactionalParams
  ): Promise<Application>;
  delete(id: number): Promise<Job>;
  findByEstablishment(establishmentId: number): Promise<Job[]>
}
