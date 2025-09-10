import { ITokenRepository } from "../../repositories/ITokenRepository";

export class DeleteToken {
  constructor(private repo: ITokenRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.repo.delete(id);
  }
}
