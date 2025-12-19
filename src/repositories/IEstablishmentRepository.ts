import { Establishment, Prisma } from "@prisma/client";
import { IAuthRepository } from "./IAuthRepository";

export interface IEstablishmentRepository  {
  create(data: Omit<Establishment, "id"|"createTime"|"socialLinks">): Promise<Establishment>;
  findById(id: number): Promise<Establishment | null>;
  findByEmail(email: string): Promise<Establishment | null>;
  findByCnpj(cnpj: string): Promise<Establishment | null>;
  update(id: number, data: Prisma.EstablishmentUpdateInput): Promise<Establishment>;
  delete(id: number): Promise<Establishment>;
}
