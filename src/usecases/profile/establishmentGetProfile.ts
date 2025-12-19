import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { AppError } from "../../utils/AppError";

export class GetProfileUseCase {
  constructor(private repo: IEstablishmentRepository) {}

  async execute(establishmentId: number) {
    const user = await this.repo.findById(establishmentId);
    if (!user) throw new AppError("Establishment not found", 404);

    const { password, ...rest } = user;
    return rest;
  }
}
