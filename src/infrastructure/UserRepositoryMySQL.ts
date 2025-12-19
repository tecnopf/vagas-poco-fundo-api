import { PrismaClient, User, Prisma } from "@prisma/client";
import { IUserRepository } from "../repositories/IUserRepository";
import prisma from "./prismaClient";

export class UserRepositoryMySQL implements IUserRepository {
  async create(data: Omit<User, "id">): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { cpf } });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
