import { IVacancyRepository } from "../../repositories/IVacancyRepository";
import { Prisma, Job } from "@prisma/client"; 
import { AppError } from "../../utils/AppError";

export class UpdateVacancyUseCase {
  constructor(private repo: IVacancyRepository) {}

  async execute(id: number, data: Prisma.JobUpdateInput): Promise<Job> {
    const job = await this.repo.findById(id);
    if (!job) throw new AppError("Vaga não encontrada", 404);
    return this.repo.update(id, data);
  }
}
