import { Request, Response } from "express";
import { LoginUseCase } from "../usecases/auth/login";
import { RegisterUseCase } from "../usecases/auth/register";
import { MagicLinkUseCase } from "../usecases/auth/magicLink";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private magicLinkUseCase: MagicLinkUseCase
  ) {}

  check = (req: Request, res: Response) => {
    res.json({ valid: true, userId: req.userId });
  };

  login = async (req: Request, res: Response) => {
    try {
      const { token, user } = await this.loginUseCase.execute(req.body);
      res.cookie("token", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      res.json({ message: "Logged in", token, user });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { token, user } = await this.registerUseCase.execute(req.body);
      res.cookie("token", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      res.status(201).json({ message: "Registered successfully", token, user });
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ error: err.message });
    }
  };

  logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  };

  sendMagicLink = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await this.magicLinkUseCase.send(email);
      res.json({ message: "Link enviado por e-mail" });
    } catch (err: any) {
      console.log(err)
      res.status(400).json({ error: err.message });
    }
  };

  magicLogin = async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: "Token ausente" });

      const { user, token: loginToken } = await this.magicLinkUseCase.loginWithToken(token as string);
      res.json({ message: "Login bem-sucedido", token: loginToken, user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
