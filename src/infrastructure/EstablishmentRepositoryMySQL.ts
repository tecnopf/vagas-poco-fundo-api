import { PrismaClient, Establishment } from "../generated/client";
import { IEstablishmentRepository } from "../repositories/IEstablishmentRepository";

const prisma = new PrismaClient();

export class PrismaEstablishmentRepository implements IEstablishmentRepository {
  async create(data: Omit<Establishment, "id">): Promise<Establishment> {
    return prisma.establishment.create({ data });
  }

  async findById(id: number): Promise<Establishment | null> {
    return prisma.establishment.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Establishment | null> {
    return prisma.establishment.findUnique({ where: { email } });
  }

  async findByCnpj(cnpj: string): Promise<Establishment | null> {
    return prisma.establishment.findUnique({ where: { cnpj } });
  }

  async update(id: number, data: Partial<Establishment>): Promise<Establishment> {
    return prisma.establishment.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Establishment> {
    return prisma.establishment.delete({ where: { id } });
  }
}
