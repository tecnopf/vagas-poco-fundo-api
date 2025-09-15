import { Request, Response } from "express";
import { GenerateToken } from "../usecases/admin/generateToken";
import { DeleteToken } from "../usecases/admin/deleteToken";
import { ADMIN_PASSWORD } from "../config/env";
import { GetTokens } from "../usecases/admin/getTokens";
import { LoginAdmin } from "../usecases/admin/login";


export class AdminController {
  constructor(
    private gerarTokenUC: GenerateToken,
    private deletarTokenUC: DeleteToken,
    private getTokensUc: GetTokens,
    private loginUC: LoginAdmin
  ) {}

  login = async (req: Request, res: Response)=>{
    const { key } = req.body;
    return this.loginUC.execute(req.body, res)
  }

  checkSession = async (req: Request, res: Response) => {
    const isValid = this.loginUC.validateCookie(req, res);
    if (!isValid) return;

    res.json({ message: "Authorized" });
  };

  getTokens = async (req: Request, res: Response) => {
    if (!this.loginUC.validateCookie(req, res)) return;
    const tokens = await this.getTokensUc.execute();
    res.json(tokens);
  };

  generateToken = async (req: Request, res: Response) => {
    if (!this.loginUC.validateCookie(req, res)) return;
    const token = await this.gerarTokenUC.execute();
    res.json(token);
  };

  deleteToken = async (req: Request, res: Response) => {
    if (!this.loginUC.validateCookie(req, res)) return;
    const { tokenID } = req.body || {};
    if (!tokenID) return res.status(400).json({ error: "Token ID is required" });

    const success = await this.deletarTokenUC.execute(tokenID);
    if (!success) return res.status(404).json({ error: "Token not found" });
    res.json({ message: "Token deleted" });
  };
}
