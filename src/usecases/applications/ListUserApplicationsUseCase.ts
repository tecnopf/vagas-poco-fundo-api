import { IApplicationRepository } from "../../repositories/IApplicationRepository";

export class ListUserApplicationsUseCase {
  constructor(
    private applicationRepository: IApplicationRepository
  ) {}

  async execute(userId: number) {
    return this.applicationRepository.findByUser(userId);
  }
}
