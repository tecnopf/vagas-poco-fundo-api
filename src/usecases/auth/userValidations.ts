import { AppError } from "../../utils/AppError"; 

export function validateCpf(cpf: string) {
  if (!cpf) throw new AppError("CPF_REQUIRED", 422);
  if (!/^\d+$/.test(cpf)) throw new AppError("CPF_ONLY_NUMBERS", 422);
  if (cpf.length !== 11) throw new AppError("CPF_INVALID", 422);
}

export function validateBirthDate(birthDateInput: string | Date): Date {
  if (!birthDateInput) throw new AppError("BIRTHDATE_REQUIRED", 422);

  const birthDate = new Date(birthDateInput);
  if (isNaN(birthDate.getTime()))
    throw new AppError("BIRTHDATE_INVALID", 422);

  const today = new Date();
  if (birthDate > today)
    throw new AppError("BIRTHDATE_IN_FUTURE", 422);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 14)
    throw new AppError("MIN_AGE_14", 422);

  return birthDate;
}
