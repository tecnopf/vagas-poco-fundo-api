import { IAuthRepository } from "../../repositories/IAuthRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { AppError } from "../../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

interface LoginRequest {
  email: string;
  password: string;
  type: 'user' | 'establishment'
}



export class LoginUseCase{
  constructor(private repo: IUserRepository | IEstablishmentRepository) {}

  async execute({ email, password, type }: LoginRequest) {
    
    const entity = await this.repo.findByEmail(email);

    if (!entity) throw new AppError("EMAIL_NOT_FOUND", 401);

    const isPasswordValid = await bcrypt.compare(password, entity.password);
    if (!isPasswordValid) throw new AppError("PASSWORD_INVALID", 401);

    const token = jwt.sign({ id: entity.id, role: type }, JWT_SECRET, { expiresIn: "3d" });

    return { token, entity };
  }
}
