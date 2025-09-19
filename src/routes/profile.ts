import { Router } from "express";
import { ensureAuth } from "../middlewares/JWTMiddleware"; 
import { GetProfileUseCase } from "../usecases/home/getProfileInfo"; 
import { ProfileController } from "../controllers/ProfilleController"; 
import { PrismaEstablishmentRepository } from "../infrastructure/EstablishmentRepositoryMySQL"; 

const profileRoutes = Router();

const repo = new PrismaEstablishmentRepository();
const getProfileUseCase = new GetProfileUseCase(repo);
const controller = new ProfileController(getProfileUseCase);

profileRoutes.get("/", ensureAuth, controller.handle);

export default profileRoutes;
