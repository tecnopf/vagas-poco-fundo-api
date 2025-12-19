import { Router } from "express";
import { GetProfileUseCase } from "../usecases/profile/establishmentGetProfile"; 
import { UpdateEstablishmentProfileUseCase } from "../usecases/profile/establishmentUpdateProfile";
import { EstablishmentProfileController } from "../controllers/ProfilleController"; 
import { PrismaEstablishmentRepository } from "../infrastructure/EstablishmentRepositoryMySQL"; 
import { UpdateSocialLinksUseCase } from "../usecases/profile/updateSocialLinks";
import { EnsureEstablishmentAuth } from "../middlewares/EstablishmentAuthMiddleware";

const establishmentProfileRoutes = Router();

const repo = new PrismaEstablishmentRepository();
const getProfileUseCase = new GetProfileUseCase(repo);
const updateEstablishmentProfileUseCase = new UpdateEstablishmentProfileUseCase(repo)
const updatedSocialLinksUseCase = new UpdateSocialLinksUseCase(repo)
const controller = new EstablishmentProfileController(getProfileUseCase, updateEstablishmentProfileUseCase, updatedSocialLinksUseCase );

establishmentProfileRoutes.get("/get", EnsureEstablishmentAuth, controller.get);
establishmentProfileRoutes.put("/update", EnsureEstablishmentAuth, controller.update);
establishmentProfileRoutes.put("/social-links", EnsureEstablishmentAuth, controller.updateSocialLinks);

export default establishmentProfileRoutes;
