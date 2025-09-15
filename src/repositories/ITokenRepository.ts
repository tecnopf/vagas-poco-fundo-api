import { Token } from "../domain/Token";
import { createTokenDto } from "../dtos/token";

export interface ITokenRepository {
  list(): Promise<Token[]>;
  save(token: createTokenDto): Promise<Token>;
  delete(tokenId: number): Promise<boolean>;
}