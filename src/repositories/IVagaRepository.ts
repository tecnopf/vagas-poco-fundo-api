// src/repositories/IVagaRepository.ts
import { Vaga } from "../domain/vaga";

export interface IVagaRepository {
  listar(): Promise<Vaga[]>;
  salvar(vaga: Vaga): Promise<void>;
}
