import { IVacancyRepository } from "../../repositories/IVacancyRepository";
import { Prisma, Job } from "@prisma/client"; 

export class CreateVacancyUseCase {
  constructor(private repo: IVacancyRepository) {}

  async execute(data: Prisma.JobCreateInput): Promise<Job> {
    return this.repo.create(data);
  }
}
