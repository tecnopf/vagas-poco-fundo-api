import { Request, Response } from "express";
import { GetProfileUseCase } from "../usecases/profile/establishmentGetProfile";
import { UpdateEstablishmentProfileUseCase } from "../usecases/profile/establishmentUpdateProfile";
import { UpdateSocialLinksUseCase } from "../usecases/profile/updateSocialLinks";

export class EstablishmentProfileController {
  constructor(private getProfileUseCase: GetProfileUseCase,
    private UpdateEstablishmentProfileUseCase: UpdateEstablishmentProfileUseCase,
    private updateSocialLinksUseCase: UpdateSocialLinksUseCase,
  ) {}

  get = async (req: Request, res: Response) => {
    try {
      if (!req.establishmentId) return res.status(401).json({ error: "Unauthorized" });
      const user = await this.getProfileUseCase.execute(Number(req.establishmentId));
      res.json(user);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      if (!req.establishmentId) return res.status(401).json({ error: "Unauthorized" });

      const { name, email, cnpj, password } = req.body;

      const updatedUser = await this.UpdateEstablishmentProfileUseCase.execute({
        establishmentId: Number(req.establishmentId),
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

  updateSocialLinks = async (req: Request, res: Response) => {
    try {
      if (!req.establishmentId) return res.status(401).json({ error: "Unauthorized" });

      const { email, useAccountEmail, facebook, whatsapp, instagram, linkedin } = req.body;

      const updatedSocialLinks = await this.updateSocialLinksUseCase.execute({
        establishmentId: Number(req.establishmentId),
        facebook,
        email,
        instagram,
        linkedin,
        whatsapp,
        useAccountEmail
      });

      res.json(updatedSocialLinks);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  };

}
