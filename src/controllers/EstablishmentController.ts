import { Request, Response } from "express";
import { LoginUseCase } from "../usecases/auth/login";
import { RegisterEstablishmentUseCase } from "../usecases/auth/establishmentRegister";
import { MagicLinkUseCase } from "../usecases/auth/magicLink";
import { UpdateEstablishmentUseCase } from "../usecases/auth/establishmentUpdate";

export class EstablishmentAuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterEstablishmentUseCase,
    private magicLinkUseCase: MagicLinkUseCase,
    private updateEstablishmentUseCase: UpdateEstablishmentUseCase
  ) {}

  check = (req: Request, res: Response) => {
    res.json({
      valid: true,
      establishmentId: req.establishmentId,
      role: "establishment",
    });
  };

  login = async (req: Request, res: Response) => {
    try {
      const { token, user } = await this.loginUseCase.execute(req.body);

      res.cookie("token", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.json({
        message: "Logged in",
        role: "establishment",
        user,
      });
    } catch (err: any) {
      res.status(err.status ?? 401).json({ error: err.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { token, establishment } =
        await this.registerUseCase.execute(req.body);

      res.cookie("token", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.status(201).json({
        message: "Registered successfully",
        role: "establishment",
        establishment,
      });
    } catch (err: any) {
      console.log(err)
      res.status(err.statusCode ?? 400).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const establishmentId = Number(req.establishmentId);

      const { name, email, cnpj, password } = req.body;

      const establishment = await this.updateEstablishmentUseCase.execute({
        establishmentId,
        name,
        email,
        cnpj,
        password,
      });

      res.json({
        message: "Establishment updated",
        establishment,
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
        message: "Login bem-sucedido",
        role: "establishment",
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
