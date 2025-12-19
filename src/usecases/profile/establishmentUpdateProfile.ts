import { Prisma } from "@prisma/client";
import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { AppError } from "../../utils/AppError";
import bcrypt from "bcryptjs";

interface UpdateProfileRequest {
  establishmentId: number;
  name?: string;
  email?: string;
  cnpj?: string;
  password?: string;
}

export class UpdateEstablishmentProfileUseCase {
  constructor(private repo: IEstablishmentRepository) {}

  async execute({ establishmentId, name, email, cnpj, password }: UpdateProfileRequest) {
    const establishment = await this.repo.findById(establishmentId);
    if (!establishment) throw new AppError("Establishment not found", 404);

    if (email && email !== establishment.email) {
      const existing = await this.repo.findByEmail(email);
      if (existing) throw new AppError("Email already registered", 409);
    }

    const updatedData: Prisma.EstablishmentUpdateInput = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (cnpj) updatedData.cnpj = cnpj;

    if (password && password.trim().length > 0) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.repo.update(establishmentId, updatedData);
    const { password: _, ...rest } = updatedUser;
    return rest;
  }
}
