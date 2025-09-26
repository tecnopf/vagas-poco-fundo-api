import { Establishment } from "../generated/client";

export interface IEstablishmentRepository {
  create(data: Omit<Establishment, "id"|"createTime"|"socialLinks">): Promise<Establishment>;
  findById(id: number): Promise<Establishment | null>;
  findByEmail(email: string): Promise<Establishment | null>;
  findByCnpj(cnpj: string): Promise<Establishment | null>;
  update(id: number, data: Partial<Establishment>): Promise<Establishment>;
  delete(id: number): Promise<Establishment>;
}
