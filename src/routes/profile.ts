import { Router } from "express";
import { ensureAuth } from "../middlewares/JWTMiddleware"; 
import { GetProfileUseCase } from "../usecases/home/getProfileInfo"; 
import { UpdateProfileUseCase } from "../usecases/profile/updateProfile";
import { ProfileController } from "../controllers/ProfilleController"; 
import { PrismaEstablishmentRepository } from "../infrastructure/EstablishmentRepositoryMySQL"; 
import { UpdateSocialLinksUseCase } from "../usecases/profile/updateSocialLinks";

const profileRoutes = Router();

const repo = new PrismaEstablishmentRepository();
const getProfileUseCase = new GetProfileUseCase(repo);
const updateProfileUseCase = new UpdateProfileUseCase(repo)
const updatedSocialLinksUseCase = new UpdateSocialLinksUseCase(repo)
const controller = new ProfileController(getProfileUseCase, updateProfileUseCase, updatedSocialLinksUseCase );

profileRoutes.get("/", ensureAuth, controller.handle);
profileRoutes.put("/", ensureAuth, controller.update);
profileRoutes.put("/social-links", ensureAuth, controller.updateSocialLinks);

export default profileRoutes;
