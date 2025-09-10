// src/usecases/gerarToken.ts
import { ITokenRepository } from "../../repositories/ITokenRepository";

export class GenerateToken {
  constructor(private repo: ITokenRepository) {}

  async execute(): Promise<string> {
    const token = Math.random().toString(36).substring(2, 9).toUpperCase();
    await this.repo.save({id: undefined, value: token});
    return token;
  }
}
