// src/controllers/VagaController.ts
import { Request, Response } from "express";
import { ListarVagas } from "../usecases/listarVagas";

export class VagaController {
  constructor(private listarVagas: ListarVagas) {}

  listar = async (req: Request, res: Response) => {
    const vagas = await this.listarVagas.execute();
    res.json(vagas);
  };
}
