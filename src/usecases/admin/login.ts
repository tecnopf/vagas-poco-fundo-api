import { ADMIN_PASSWORD } from "../../config/env";
import { Request, Response } from "express";

export class LoginAdmin {
  execute(reqBody: { key: string }, res: Response) {
    const { key } = reqBody;
    if (key === ADMIN_PASSWORD) {
      res.cookie("admin_session", key, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000, 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res.json({ message: "Login ok" });
    }
    return res.status(401).json({ error: "Wrong key" });
  }
  validateCookie(req: Request, res: Response): boolean {
    const key = req.cookies?.admin_session;
    if (!key || key !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Session expired or invalid" });
      return false;
    }
    return true;
  }
}
