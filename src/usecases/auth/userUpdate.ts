import { IUserRepository } from "../../repositories/IUserRepository";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import { validateCpf, validateBirthDate } from "./userValidations";

export class UpdateUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute({ userId, data }: any) {
    const user = await this.repo.findById(userId);
    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    const updateData: Prisma.UserUpdateInput = {};

    if (data.name) updateData.name = data.name;

    if (data.email) {
      const existing = await this.repo.findByEmail(data.email);
      if (existing && existing.id !== userId)
        throw new AppError("EMAIL_ALREADY_EXISTS", 409);

      updateData.email = data.email;
    }

    if (data.cpf && data.cpf !== user.cpf) {
      validateCpf(data.cpf);
      const existingCpf = await this.repo.findByCpf(data.cpf);
      if (existingCpf && existingCpf.id !== userId)
        throw new AppError("CPF_ALREADY_EXISTS", 409);
      updateData.cpf = data.cpf;
    }

    


    if (data.birthDate) {
      updateData.birthDate = validateBirthDate(data.birthDate);
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.repo.update(userId, updateData);
  }
}
