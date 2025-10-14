// src/usecases/auth/magicLink.ts
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { IEstablishmentRepository } from "../../repositories/IEstablishmentRepository";
import { FRONTEND_URL, MAIL_PASS, MAIL_USER } from "../../config/env";

export class MagicLinkUseCase {
  constructor(private establishmentRepo: IEstablishmentRepository) {}

  async send(email: string): Promise<void> {
    const user = await this.establishmentRepo.findByEmail(email);
    if (!user) throw new Error("E-mail não encontrado");

    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );

    const link = `${FRONTEND_URL}/auth/magic-login?token=${token}`;

    console.log('user: ', MAIL_USER, ', pass: ', MAIL_PASS)
    console.log(link)

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Suporte" <${MAIL_USER}>`,
      to: email,
      subject: "Acesse sua conta",
      html: `
        <h2>Recuperar acesso</h2>
        <p>Clique no link abaixo para acessar sua conta:</p>
        <a href="${link}">${link}</a>
        <p>O link expira em 10 minutos.</p>
      `,
    });
  }

  async loginWithToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        email: string;
      };

      const user = await this.establishmentRepo.findById(payload.id);
      if (!user) throw new Error("Usuário não encontrado");

      const loginToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "3d" }
      );

      return { user, token: loginToken };
    } catch {
      throw new Error("Link inválido ou expirado");
    }
  }
}
