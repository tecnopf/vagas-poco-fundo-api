import { Router } from "express";
import { UserAuthController } from "../controllers/UserController";
import { UserRepositoryMySQL } from "../infrastructure/UserRepositoryMySQL";
import { makeUserAuth } from "../usecases/auth/AuthFactory";
import { EnsureUserAuth } from "../middlewares/UserAuthMiddleware";

const router = Router();

const repo = new UserRepositoryMySQL();

const { login, register, update, magicLink } = makeUserAuth(repo);

const authController = new UserAuthController(login, register, magicLink, update);

router.post("/login", authController.login);
router.post("/check", EnsureUserAuth, authController.check);
router.put("/update", EnsureUserAuth, authController.update);
router.post("/register", authController.register);
router.post("/magic-link",  authController.sendMagicLink);
router.get("/magic-login", authController.magicLogin);

export default router;
