import { IResumeStorageService } from "./IResumeStorageService";
import { Client } from "basic-ftp";
import { Readable } from "stream";

export class FtpResumeStorageService implements IResumeStorageService {
  async upload({
    fileBuffer,
    userName,
    jobTitle,
    date
  }: {
    fileBuffer: Buffer;
    userName: string;
    jobTitle: string;
    date: Date;
  }): Promise<string> {
    const client = new Client();
    await client.access({
      host: process.env.FTP_HOST!,
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASSWORD!
    });

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const safeUser = userName.replace(/\s+/g, "-");
    const safeJob = jobTitle.replace(/\s+/g, "-");

    const fileName = `curriculo_${safeUser}_${safeJob}_${day}-${month}-${year}.pdf`;
    const remoteDir = `/vagaspf_curriculos/${year}/${month}`;

    const stream = Readable.from(fileBuffer);

    await client.ensureDir(remoteDir);
    await client.uploadFrom(stream, `${remoteDir}/${fileName}`);
    client.close();

    return `${process.env.BASE_URL}${remoteDir}/${fileName}`;
  }
  
  async delete(resumeUrl: string): Promise<void> {
    const client = new Client();

    await client.access({
      host: process.env.FTP_HOST!,
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASSWORD!,
      secure: process.env.FTP_SECURE === "true"
    });

    const baseUrl = process.env.RESUME_BASE_URL!;
    const relativePath = resumeUrl.replace(baseUrl, "");

    await client.remove(relativePath);
    client.close();
  }

}
