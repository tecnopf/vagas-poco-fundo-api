import { Prisma } from "@prisma/client";
import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { AppError } from "../../utils/AppError";
import { validateEstablishmentData } from "./establishmentValidations";
import bcrypt from "bcryptjs";

interface UpdateEstablishmentRequest {
  establishmentId: number;
  name?: string;
  email?: string;
  cnpj?: string;
  password?: string;
}

export class UpdateEstablishmentUseCase {
  constructor(private repo: IEstablishmentRepository) {}

  async execute({ establishmentId, name, email, cnpj, password }: UpdateEstablishmentRequest) {
    const user = await this.repo.findById(establishmentId);
    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    validateEstablishmentData({ name, cnpj });

    if (email && email !== user.email) {
      const existing = await this.repo.findByEmail(email);
      if (existing) throw new AppError("EMAIL_ALREADY_EXISTS", 409);
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
