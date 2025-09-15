import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { GenerateToken } from "../usecases/admin/generateToken";
import { DeleteToken } from "../usecases/admin/deleteToken";
import { TokenRepositoryJSON } from "../infrastructure/TokenRepositoryJSON";
import { TokenRepositoryMySQL } from "../infrastructure/TokenRepositoryMySQL";
import { IS_PRODUCTION } from "../config/env";
import { GetTokens } from "../usecases/admin/getTokens";
import { LoginAdmin } from "../usecases/admin/login";

const router = Router();

let repo;
if (IS_PRODUCTION) {
  repo = new TokenRepositoryMySQL
} else {
  repo = new TokenRepositoryJSON(); 
}

const generateTokenUC = new GenerateToken(repo);
const deleteTokenUC = new DeleteToken(repo);
const getTokensUc = new GetTokens(repo)
const loginUC = new LoginAdmin()
const controller = new AdminController(generateTokenUC, deleteTokenUC, getTokensUc, loginUC);


router.post("/login", controller.login)
router.get("/check-session", controller.checkSession)
router.get("/tokens", controller.getTokens)
router.post("/generate-token", controller.generateToken);
router.delete("/delete-token", controller.deleteToken);

export default router;
