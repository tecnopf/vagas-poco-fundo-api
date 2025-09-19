import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { ITokenRepository } from "../../repositories/ITokenRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

interface RegisterRequest {
  name: string;
  cnpj: string;
  email: string;
  password: string;
  luckyWord: string;
  tokenValue: string;
}

export class RegisterUseCase {
  constructor(
    private repo: IEstablishmentRepository,
    private tokenRepo: ITokenRepository
  ) {}

  async execute({ name, cnpj, email, password, tokenValue }: RegisterRequest) {
    const token = await this.tokenRepo.findByValue(tokenValue);
    if (!token) throw new AppError("Invalid or expired token", 401);

    const existing = await this.repo.findByEmail(email);
    if (existing) throw new AppError("Email already registered",409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.repo.create({
      name,
      cnpj,
      email,
      password: hashedPassword,
    });

    await this.tokenRepo.delete(token.id);

    const jwtToken = jwt.sign({ id: (await newUser).id }, JWT_SECRET, { expiresIn: "3d" });

    return { token: jwtToken, user: newUser };
  }
}
