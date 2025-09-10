// src/usecases/listarVagas.ts
import { IVagaRepository } from "../repositories/IVagaRepository";
import { Vaga } from "../domain/vaga";

export class ListarVagas {
  constructor(private vagaRepo: IVagaRepository) {}

  async execute(): Promise<Vaga[]> {
    return await this.vagaRepo.listar();
  }
}
