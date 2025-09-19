import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { AppError } from "../../utils/AppError";

export class GetProfileUseCase {
  constructor(private repo: IEstablishmentRepository) {}

  async execute(userId: number) {
    const user = await this.repo.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const { password, ...rest } = user;
    return rest;
  }
}
