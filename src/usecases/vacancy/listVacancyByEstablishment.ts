import { IVacancyRepository } from "../../repositories/IVacancyRepository";
import { Job } from "@prisma/client";

export class ListVacanciesByEstablishmentUseCase {
  constructor(private repo: IVacancyRepository) {}

  async execute(establishmentId: number): Promise<Job[]> {
    return this.repo.findByEstablishment(establishmentId);
  }
}
