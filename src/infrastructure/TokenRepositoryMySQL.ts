import { ITokenRepository } from "../repositories/ITokenRepository";
import { Token as DomainToken } from "../domain/Token";
import  prisma  from "./prismaClient";
import { createTokenDto } from "../dtos/token";

export class TokenRepositoryMySQL implements ITokenRepository {
  async list(): Promise<DomainToken[]> {
    const tokens = await prisma.token.findMany();
    return tokens.map(t => ({ id: Number(t.id), value: t.value }));
  }

  async save(token: createTokenDto): Promise<void> {
    await prisma.token.create({
      data: {
        value: token.value,
      },
    });
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await prisma.token.deleteMany({
      where: { id: id },
    });
    return result.count > 0;
  }
}
