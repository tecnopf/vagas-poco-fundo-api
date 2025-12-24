import { Router } from "express";
import { VacancyController } from "../controllers/VacancyController";
import { CreateVacancyUseCase } from "../usecases/vacancy/createNewVacancy";
import { ListVacanciesUseCase } from "../usecases/vacancy/listVacancies";
import { UpdateVacancyUseCase } from "../usecases/vacancy/updateVacancy";
import { DeleteVacancyUseCase } from "../usecases/vacancy/deleteVacancy";
import { PrismaVacancyRepository } from "../infrastructure/VacancyRepositoryMySQL";
import { ListVacanciesByEstablishmentUseCase } from "../usecases/vacancy/listVacancyByEstablishment";
import { EnsureEstablishmentAuth } from "../middlewares/EstablishmentAuthMiddleware";

const router = Router();

const repo = new PrismaVacancyRepository()
const controller = new VacancyController(
  new CreateVacancyUseCase(repo),
  new ListVacanciesUseCase(repo),
  new UpdateVacancyUseCase(repo),
  new DeleteVacancyUseCase(repo),
  new ListVacanciesByEstablishmentUseCase(repo)
);

router.post("/", EnsureEstablishmentAuth, (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.list(req, res));
router.get("/establishment", EnsureEstablishmentAuth, (req, res) => controller.listByEstablishment(req, res));
router.put("/", EnsureEstablishmentAuth, (req, res) => controller.update(req, res));
router.delete("/", EnsureEstablishmentAuth, (req, res) => controller.delete(req, res));

export default router;
