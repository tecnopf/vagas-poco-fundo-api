// src/routes/vagas.ts
import { Router } from "express";
import { VagaController } from "../controllers/VagaController";
import { ListarVagas } from "../usecases/listarVagas";
import { VagaRepositoryMemory } from "../infrastructure/VagaRepositoryMemory";

const router = Router();

// Instâncias (injeção de dependência manual)
const repo = new VagaRepositoryMemory();
const listarVagasUseCase = new ListarVagas(repo);
const vagaController = new VagaController(listarVagasUseCase);

router.get("/vagas", vagaController.listar);

export default router;
