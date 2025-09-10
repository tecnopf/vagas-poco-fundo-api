// src/infrastructure/VagaRepositoryMemory.ts
import { IVagaRepository } from "../repositories/IVagaRepository";
import { Vaga } from "../domain/vaga";

export class VagaRepositoryMemory implements IVagaRepository {
  private vagas: Vaga[] = [
    new Vaga(1, "Desenvolvedor Node.js", "Vaga para dev Node.js"),
    new Vaga(2, "Frontend React", "Vaga para frontend React")
  ];

  async listar(): Promise<Vaga[]> {
    return this.vagas;
  }

  async salvar(vaga: Vaga): Promise<void> {
    this.vagas.push(vaga);
  }
}
