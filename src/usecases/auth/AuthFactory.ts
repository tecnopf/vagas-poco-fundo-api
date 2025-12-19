import { LoginUseCase } from "./login";
import { RegisterEstablishmentUseCase } from "./establishmentRegister";
import { MagicLinkUseCase } from "./magicLink";
import { ITokenRepository } from "../../repositories/ITokenRepository";
import { RegisterUserUseCase } from "./userRegister";
import { UpdateUserUseCase } from "./userUpdate";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { UpdateEstablishmentUseCase } from "./establishmentUpdate";


export function makeEstablishmentAuth(
  repo: IEstablishmentRepository,
  tokenRepo: ITokenRepository
) {
  return {
    login: new LoginUseCase(repo),
    register: new RegisterEstablishmentUseCase(repo, tokenRepo),
    magicLink: new MagicLinkUseCase(repo),
    update: new UpdateEstablishmentUseCase(repo)
  };
}


export function makeUserAuth(
  repo: IUserRepository
) {
  return {
    login: new LoginUseCase(repo),
    register: new RegisterUserUseCase(repo),
    magicLink: new MagicLinkUseCase(repo),
    update: new UpdateUserUseCase(repo)
  };
}
