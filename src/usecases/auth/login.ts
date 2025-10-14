import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

interface LoginRequest {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private repo: IEstablishmentRepository) {}

  async execute({ email, password }: LoginRequest) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid user");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
      
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "3d" });

    return { token, user };
  }
}
