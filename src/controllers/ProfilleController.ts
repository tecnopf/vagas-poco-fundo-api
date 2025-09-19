import { Request, Response } from "express";
import { GetProfileUseCase } from "../usecases/home/getProfileInfo";

export class ProfileController {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  handle = async (req: Request, res: Response) => {
    try {
      if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
      const user = await this.getProfileUseCase.execute(Number(req.userId));
      res.json(user);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  };
}
