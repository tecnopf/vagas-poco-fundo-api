import { AppError } from "../../utils/AppError";

interface EstablishmentValidationData {
  name?: string;
  cnpj?: string;
}

export function validateEstablishmentData(data: EstablishmentValidationData) {
  if (data.name !== undefined && !data.name)
    throw new AppError("ESTABLISHMENT_NAME_REQUIRED", 422);

  if (!data.cnpj)
      throw new AppError("CNPJ_REQUIRED", 422);

  if (data.cnpj !== undefined) {
    if (!/^\d+$/.test(data.cnpj))
      throw new AppError("CNPJ_ONLY_NUMBERS", 422);

    if (data.cnpj.length !== 14)
      throw new AppError("CNPJ_INVALID", 422);
  }
}
