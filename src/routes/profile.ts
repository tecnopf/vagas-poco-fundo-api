import { Router } from "express";
import { ensureAuth } from "../middlewares/JWTMiddleware"; 
import { GetProfileUseCase } from "../usecases/home/getProfileInfo"; 
import { UpdateProfileUseCase } from "../usecases/profile/updateProfile";
import { ProfileController } from "../controllers/ProfilleController"; 
import { PrismaEstablishmentRepository } from "../infrastructure/EstablishmentRepositoryMySQL"; 

const profileRoutes = Router();

const repo = new PrismaEstablishmentRepository();
const getProfileUseCase = new GetProfileUseCase(repo);
const updateProfileUseCase = new UpdateProfileUseCase(repo)
const controller = new ProfileController(getProfileUseCase, updateProfileUseCase);

profileRoutes.get("/", ensureAuth, controller.handle);
profileRoutes.put("/", ensureAuth, controller.update);

export default profileRoutes;
