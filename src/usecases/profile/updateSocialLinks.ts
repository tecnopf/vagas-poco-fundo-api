import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { AppError } from "../../utils/AppError";

interface UpdateSocialLinksRequest {
  establishmentId: number;
  email?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  linkedin?: string;
  useAccountEmail?: boolean;
}

type SocialLinks = {
  email?: string;
  whatsapp?: string;
  instagram?: string;
  useAccountEmail?: boolean;
  linkedin?: string;
  facebook?: string;
};

export class UpdateSocialLinksUseCase {
  constructor(private repo: IEstablishmentRepository) {}

  async execute({ email, useAccountEmail, whatsapp, instagram, linkedin, establishmentId }: UpdateSocialLinksRequest) {
    const establishment = await this.repo.findById(establishmentId);
    if (!establishment) throw new AppError("Establishment not found", 404);

    const socialLinks = establishment.socialLinks as SocialLinks || {};

    

    if(useAccountEmail){
      socialLinks.email = establishment.email
    } else {
      if (email && email.length > 0) socialLinks.email = email;
    }

    if (whatsapp && whatsapp.length > 0) socialLinks.whatsapp = whatsapp;
    if (instagram && instagram.length > 0) socialLinks.instagram = instagram;
    if (linkedin && linkedin.length > 0) socialLinks.linkedin = linkedin;

    const updated = await this.repo.update(establishmentId, {
      socialLinks,
    });

    return updated;
  }
}
