import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { PrismaEstablishmentRepository } from "../infrastructure/EstablishmentRepositoryMySQL";
import { TokenRepositoryMySQL } from "../infrastructure/TokenRepositoryMySQL";
import { LoginUseCase } from "../usecases/auth/login";
import { RegisterUseCase } from "../usecases/auth/register";

const router = Router();

const establishmentRepo = new PrismaEstablishmentRepository();
const tokenRepo = new TokenRepositoryMySQL();

const loginUC = new LoginUseCase(establishmentRepo);
const registerUC = new RegisterUseCase(establishmentRepo, tokenRepo);

const authController = new AuthController(loginUC, registerUC);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/register", authController.register);

export default router;

