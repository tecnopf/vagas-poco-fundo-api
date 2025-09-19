// src/infrastructure/TokenRepositoryJSON.ts
import { ITokenRepository } from "../repositories/ITokenRepository";
import { Token } from "../domain/Token";
import fs from "fs";
import path from "path";
import { createTokenDto } from "../dtos/token";

const FILE_PATH = path.join(__dirname, "../../tokens.json");

export class TokenRepositoryJSON implements ITokenRepository {
  private async read(): Promise<Token[]> {
    if (!fs.existsSync(FILE_PATH)) return [];
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
  }

  private async write(tokens: Token[]) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tokens, null, 2));
  }

  async list(): Promise<Token[]> {
    return this.read();
  }

  async save(token: createTokenDto): Promise<Token> {
    const tokens = await this.read();
    const tokenId = tokens.length > 0 ? tokens[tokens.length - 1].id! + 1 : 1;
    const newToken: Token = { value: token.value, id: tokenId };

    tokens.push(newToken);
    await this.write(tokens);
    return newToken;
  }

  async delete(id: number): Promise<boolean> {
    const tokens = await this.read();
    const filtered = tokens.filter((t) => t.id !== id);

    if (filtered.length === tokens.length) return false;

    await this.write(filtered);
    return true;
  }

  // Novo método
  async findByValue(value: string): Promise<Token | null> {
    const tokens = await this.read();
    const token = tokens.find((t) => t.value === value);
    return token || null;
  }
}
