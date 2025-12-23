import { Request, Response } from "express";
import { LoginUseCase } from "../usecases/auth/login";
import { RegisterUserUseCase } from "../usecases/auth/userRegister";
import { MagicLinkUseCase } from "../usecases/auth/magicLink";
import { UpdateUserUseCase } from "../usecases/auth/userUpdate";

export class UserAuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUserUseCase,
    private magicLinkUseCase: MagicLinkUseCase,
    private updateUserUseCase: UpdateUserUseCase
  ) {}

  check = (req: Request, res: Response) => {
    res.json({ valid: true, userId: req.userId, role: "user" });
  };

  login = async (req: Request, res: Response) => {
    try {
      const { token, entity } = await this.loginUseCase.execute({...req.body, type:'user'});

      res.cookie("token", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.json({
        message: "Logged in",
        role: "user",
        user: entity,
      });
    } catch (err: any) {
      res.status(err.status ?? 401).json({ error: err.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { token, user } = await this.registerUseCase.execute(req.body);

      res.cookie("token", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.status(201).json({
        message: "Registered successfully",
        role: "user",
        user,
      });
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.userId);

      const user = await this.updateUserUseCase.execute({
        userId,
        data: req.body,
      });

      res.json({
        message: "User updated",
        user,
      });
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ error: err.message });
    }
  };

  sendMagicLink = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      await this.magicLinkUseCase.send(email);

      res.json({ message: "Magic link sent" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  magicLogin = async (req: Request, res: Response) => {
    try {
      const { token } = req.query as { token: string };

      const { user, token: loginToken } =
        await this.magicLinkUseCase.loginWithToken(token);

      res.cookie("token", loginToken, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.json({
        message: "Logged in with magic link",
        role: "user",
        user,
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  };
}
