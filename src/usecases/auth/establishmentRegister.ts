import { AppError } from "../../utils/AppError";
import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { ITokenRepository } from "../../repositories/ITokenRepository";
import { validateEstablishmentData } from "./establishmentValidations";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

interface RegisterEstablishmentRequest {
  email: string;
  password: string;
  tokenValue: string;
  data: {
    name: string;
    cnpj: string;
  };
}

export class RegisterEstablishmentUseCase {
  constructor(
    private repo: IEstablishmentRepository,
    private tokenRepo: ITokenRepository
  ) {}

  async execute({ email, password, tokenValue, data }: RegisterEstablishmentRequest) {
    if (!tokenValue) throw new AppError("TOKEN_REQUIRED", 401);

    const token = await this.tokenRepo.findByValue(tokenValue);
    if (!token) throw new AppError("TOKEN_INVALID_OR_EXPIRED", 401);

    if (!email) throw new AppError("EMAIL_REQUIRED", 422);
    if (!password) throw new AppError("PASSWORD_REQUIRED", 422);

    validateEstablishmentData(data);

    console.log('cnpj: ',data.cnpj)

    const existing = await this.repo.findByEmail(email);
    if (existing) throw new AppError("EMAIL_ALREADY_EXISTS", 409);
    const existingCnpj = await this.repo.findByCnpj(data.cnpj);
    if (existingCnpj) throw new AppError("CNPJ_ALREADY_EXISTS", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const establishment = await this.repo.create({
      name: data.name,
      cnpj: data.cnpj,
      email,
      password: hashedPassword,
    });

    await this.tokenRepo.delete(token.id);

    const jwtToken = jwt.sign(
      { id: establishment.id },
      JWT_SECRET,
      { expiresIn: "3d" }
    );

    return { token: jwtToken, establishment };
  }
}
