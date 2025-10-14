import { Job, Prisma } from "../generated/client";

export interface IVacancyRepository {
  create(data: Prisma.JobCreateInput): Promise<Job>;
  findAll(page?: number, pageSize?: number): Promise<{ jobs: Job[]; hasMore: boolean }>;
  findById(id: number): Promise<Job | null>;
  update(id: number, data: Prisma.JobUpdateInput): Promise<Job>;
  delete(id: number): Promise<Job>;
  findByEstablishment(establishmentId: number): Promise<Job[]>
}
