// src/usecases/gerarToken.ts
import { Token } from "../../domain/Token";
import { ITokenRepository } from "../../repositories/ITokenRepository";

export class GenerateToken {
  constructor(private repo: ITokenRepository) {}

  async execute(): Promise<Token> {
    const token = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newToken = await this.repo.save({ value: token });
    return newToken;
  }
}
