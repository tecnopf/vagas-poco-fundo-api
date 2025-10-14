import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { PrismaEstablishmentRepository } from "../infrastructure/EstablishmentRepositoryMySQL";
import { TokenRepositoryMySQL } from "../infrastructure/TokenRepositoryMySQL";
import { LoginUseCase } from "../usecases/auth/login";
import { RegisterUseCase } from "../usecases/auth/register";
import { ensureAuth } from "../middlewares/JWTMiddleware";
import { MagicLinkUseCase } from "../usecases/auth/magicLink";

const router = Router();

const establishmentRepo = new PrismaEstablishmentRepository();
const tokenRepo = new TokenRepositoryMySQL();

const loginUC = new LoginUseCase(establishmentRepo);
const registerUC = new RegisterUseCase(establishmentRepo, tokenRepo);
const magicLinkUC = new MagicLinkUseCase(establishmentRepo)

const authController = new AuthController(loginUC, registerUC, magicLinkUC);

router.get("/check", ensureAuth, authController.check);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/register", authController.register);
router.post("/magic-link", authController.sendMagicLink);
router.get("/magic-login", authController.magicLogin);

export default router;

