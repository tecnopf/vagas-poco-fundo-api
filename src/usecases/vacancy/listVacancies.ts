import { IVacancyRepository } from "../../repositories/IVacancyRepository";
import { Job } from "../../generated/client";

export class ListVacanciesUseCase {
  constructor(private repo: IVacancyRepository) {}

  async execute(page = 0, pageSize = 30) {
    return this.repo.findAll(page, pageSize);
  }
}
