import { IApplicationRepository } from "../../repositories/IApplicationRepository";

export class ListEstablishmentApplicationsUseCase {
  constructor(
    private applicationRepository: IApplicationRepository
  ) {}

  async execute(establishmentId: number) {
    return this.applicationRepository.findByEstablishment(establishmentId);
  }
}
