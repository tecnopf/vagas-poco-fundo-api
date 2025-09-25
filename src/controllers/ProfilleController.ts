import { Request, Response } from "express";
import { GetProfileUseCase } from "../usecases/home/getProfileInfo";
import { UpdateProfileUseCase } from "../usecases/profile/updateProfile";

export class ProfileController {
  constructor(private getProfileUseCase: GetProfileUseCase,
    private updateProfileUseCase: UpdateProfileUseCase
  ) {}

  handle = async (req: Request, res: Response) => {
    try {
      if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
      const user = await this.getProfileUseCase.execute(Number(req.userId));
      res.json(user);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

      const { name, email, cnpj, password } = req.body;

      const updatedUser = await this.updateProfileUseCase.execute({
        userId: Number(req.userId),
        name,
        email,
        cnpj,
        password,
      });

      res.json(updatedUser);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  };
}
