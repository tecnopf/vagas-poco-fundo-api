import { ITokenRepository } from "../repositories/ITokenRepository";
import { Token as DomainToken, Token } from "../domain/Token";
import  prisma  from "./prismaClient";
import { createTokenDto } from "../dtos/token";

export class TokenRepositoryMySQL implements ITokenRepository {
  async list(): Promise<DomainToken[]> {
    const tokens = await prisma.token.findMany();
    return tokens.map(t => ({ id: Number(t.id), value: t.value }));
  }

  async findByValue(value: string): Promise<DomainToken | null> {
    const token = await prisma.token.findFirst({
      where: { value: value },
      select: { id: true, value: true },
    });
    if (!token) return null;
    return { id: Number(token.id), value: token.value };
  }

  async save(token: createTokenDto): Promise<Token> {
    return prisma.token.create({
    data: {
      value: token.value,
    },
    select: {
      id: true,
      value: true,
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
