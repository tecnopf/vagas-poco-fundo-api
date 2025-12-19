import { User, Prisma } from "@prisma/client";

export interface IUserRepository {
  create(data: Omit<User, "id">): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>; 
  findByCpf(cpf: string): Promise<User | null>;
  update(id: number, data: Prisma.UserUpdateInput): Promise<User>; 
  delete(id: number): Promise<User>; 
}
