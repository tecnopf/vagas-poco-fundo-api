import { Router } from "express";
import { VacancyController } from "../controllers/VacancyController";
import { CreateVacancyUseCase } from "../usecases/vacancy/createNewVacancy";
import { ListVacanciesUseCase } from "../usecases/vacancy/listVacancies";
import { UpdateVacancyUseCase } from "../usecases/vacancy/updateVacancy";
import { DeleteVacancyUseCase } from "../usecases/vacancy/deleteVacancy";
import { PrismaVacancyRepository } from "../infrastructure/VacancyRepositoryMySQL";
import { ensureAuth } from "../middlewares/JWTMiddleware";
import { ListVacanciesByEstablishmentUseCase } from "../usecases/vacancy/listVacancyByEstablishment";

const router = Router();

const repo = new PrismaVacancyRepository()
const controller = new VacancyController(
  new CreateVacancyUseCase(repo),
  new ListVacanciesUseCase(repo),
  new UpdateVacancyUseCase(repo),
  new DeleteVacancyUseCase(repo),
  new ListVacanciesByEstablishmentUseCase(repo)
);

router.post("/", ensureAuth, (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.list(req, res));
router.get("/establishment", ensureAuth, (req, res) => controller.listByEstablishment(req, res));
router.put("/", ensureAuth, (req, res) => controller.update(req, res));
router.delete("/", ensureAuth, (req, res) => controller.delete(req, res));

export default router;
