// src/controllers/AdminController.ts
import { Request, Response } from "express";
import { GenerateToken } from "../usecases/admin/generateToken";
import { DeleteToken } from "../usecases/admin/deleteToken";
import { ADMIN_PASSWORD } from "../config/env";
import { GetTokens } from "../usecases/admin/getTokens";


export class AdminController {
  constructor(
    private gerarTokenUC: GenerateToken,
    private deletarTokenUC: DeleteToken,
    private getTokensUc: GetTokens
  ) {}

  private validatePassw(req: Request): boolean {
    return req.headers["x-admin-password"] === ADMIN_PASSWORD;
  }

  getTokens = async (req: Request, res: Response) => {
    if (!this.validatePassw(req)) return res.status(401).json({ error: "Unauthorized" });
    const tokens = await this.getTokensUc.execute();
    res.json(tokens);
  };

  generateToken = async (req: Request, res: Response) => {
    if (!this.validatePassw(req)) return res.status(401).json({ error: "Unauthorized" });
    const token = await this.gerarTokenUC.execute();
    res.json({ token });
  };

  deleteToken = async (req: Request, res: Response) => {
    if (!this.validatePassw(req)) return res.status(401).json({ error: "Unauthorized" });
    const { tokenID } = req.body || {};
    if (!tokenID) return res.status(400).json({ error: "Token ID is required" });

    const success = await this.deletarTokenUC.execute(tokenID);
    if (!success) return res.status(404).json({ error: "Token not found" });
    res.json({ message: "Token deleted" });
  };
}
