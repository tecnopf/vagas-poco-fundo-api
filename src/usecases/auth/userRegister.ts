import { AppError } from "../../utils/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateCpf, validateBirthDate } from "./userValidations";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export class RegisterUserUseCase {
  constructor(protected repo: IUserRepository) {}

  async execute({ email, password, data }: any) {
    if (!data.name) throw new AppError("NAME_REQUIRED", 422);
    if (!password) throw new AppError("PASSWORD_REQUIRED", 422);

    validateCpf(data.cpf);
    const existingCpf = await this.repo.findByCpf(data.cpf);
    if (existingCpf) throw new AppError("CPF_ALREADY_EXISTS", 409);
    
    const birthDate = validateBirthDate(data.birthDate);

    const existing = await this.repo.findByEmail(email);
    if (existing) throw new AppError("EMAIL_ALREADY_EXISTS", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.repo.create({
      name: data.name,
      cpf: data.cpf,
      birthDate,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "3d" });
    return { token, user };
  }
}
