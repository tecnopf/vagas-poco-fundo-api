export interface IResumeStorageService {
  upload(params: {
    fileBuffer: Buffer;
    userName: string;
    jobTitle: string;
    date: Date;
  }): Promise<string>;
  delete(resumeUrl: string): Promise<void>;
}
