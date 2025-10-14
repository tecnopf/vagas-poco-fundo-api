import { IVacancyRepository } from "../../repositories/IVacancyRepository";
import { AppError } from "../../utils/AppError";
import { Job } from "../../generated/client";

export class DeleteVacancyUseCase {
  constructor(private repo: IVacancyRepository) {}

  async execute(id: number): Promise<Job> {
    const job = await this.repo.findById(id);
    if (!job) throw new AppError("Vaga não encontrada", 404);
    return this.repo.delete(id);
  }
}
