import { Token } from "../../domain/Token";
import { ITokenRepository } from "../../repositories/ITokenRepository";

export class GetTokens {
  constructor(private repo: ITokenRepository) {}

  async execute(): Promise<Token[]> {
    return await this.repo.list();
  }
}
