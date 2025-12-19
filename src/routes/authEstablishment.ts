import { Router } from "express";
import { EstablishmentAuthController } from "../controllers/EstablishmentController";
import { PrismaEstablishmentRepository } from "../infrastructure/EstablishmentRepositoryMySQL";
import { TokenRepositoryMySQL } from "../infrastructure/TokenRepositoryMySQL";
import { EnsureEstablishmentAuth } from "../middlewares/EstablishmentAuthMiddleware";
import { makeEstablishmentAuth } from "../usecases/auth/AuthFactory";

const router = Router();

const repo = new PrismaEstablishmentRepository();
const tokenRepo = new TokenRepositoryMySQL();


const { login, register, update, magicLink } = makeEstablishmentAuth(repo, tokenRepo);

const authController = new EstablishmentAuthController(login, register, magicLink, update);

router.post("/check", EnsureEstablishmentAuth, authController.check);
router.post("/login", authController.login);
router.post("/logout", EnsureEstablishmentAuth, authController.logout);
router.put("/update", EnsureEstablishmentAuth, authController.update);
router.post("/register", authController.register);
router.post("/magic-link", authController.sendMagicLink);
router.get("/magic-login", authController.magicLogin);

export default router;

