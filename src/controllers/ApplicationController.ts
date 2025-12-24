import { Request, Response } from "express";
import { ApplyToJobUseCase } from "../usecases/applications/ApplyToJobUseCase";
import { ListUserApplicationsUseCase } from "../usecases/applications/ListUserApplicationsUseCase"; 
import { ListEstablishmentApplicationsUseCase } from "../usecases/applications/ListEstablishmentApplicationsUseCase"; 
import { ApproveApplicationUseCase } from "../usecases/applications/ApproveApplicationsUseCase"; 
import { DisapproveApplicationUseCase } from "../usecases/applications/DisapproveApplicationsUseCase"; 
import { FtpResumeStorageService } from "../services/ResumeStorageService";
import { IResumeStorageService } from "../services/IResumeStorageService";
import { IVacancyRepository } from "../repositories/IVacancyRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { AppError } from "../utils/AppError";

export class ApplicationsController {
  constructor(
    private applyToJobUseCase: ApplyToJobUseCase,
    private listUserApplicationsUseCase: ListUserApplicationsUseCase,
    private listEstablishmentApplicationsUseCase: ListEstablishmentApplicationsUseCase,
    private approveApplicationUseCase: ApproveApplicationUseCase,
    private disapproveApplicationUseCase: DisapproveApplicationUseCase,
    private resumeStorageService: IResumeStorageService,
    private vacancyRepository: IVacancyRepository,
    private userRepository: IUserRepository
  ) {}

  apply = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.userId);

      const jobId = req.body.jobId;
      const file = req.file;

      const job = await this.vacancyRepository.findById(Number(jobId));
      if (!job) throw new AppError("VACANCY_NOT_FOUND", 404);

      let resumeUrl = ''

      if(file){
        const user = await this.userRepository.findById(userId)
        if (!user) throw new AppError("USER_NOT_FOUND", 404);

        resumeUrl = await this.resumeStorageService.upload({
          fileBuffer: file.buffer,
          userName: user?.name,
          jobTitle: job.title,
          date: new Date()
        });
      }

      const application = await this.applyToJobUseCase.execute({
        userId,
        job: job,
        resumeUrl
      })

      res.status(201).json({
        message: "Application created",
        application
      });
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ error: err.message });
    }
  };

  listUserApplications = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.userId);

      const applications =
        await this.listUserApplicationsUseCase.execute(userId);

      res.json(applications);
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ error: err.message });
    }
  };

  listEstablishmentApplications = async (req: Request, res: Response) => {
    try {
      const establishmentId = Number(req.establishmentId);

      const applications =
        await this.listEstablishmentApplicationsUseCase.execute(establishmentId);

      res.json(applications);
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ error: err.message });
    }
  };

  approve = async (req: Request, res: Response) => {
    try {
      const establishmentId = Number(req.establishmentId);
      const applicationId = Number(req.params.id);

      const {
        interviewAddress,
        interviewPhone,
        interviewEmail,
        interviewDateTime
      } = req.body;

      const application = await this.approveApplicationUseCase.execute({
        establishmentId,
        applicationId,
        interviewAddress,
        interviewPhone,
        interviewEmail,
        interviewDateTime
      });

      res.json({
        message: "Application approved",
        application
      });
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ error: err.message });
    }
  };

  disapprove = async (req: Request, res: Response) => {
    try {
      const establishmentId = Number(req.establishmentId);
      const applicationId = Number(req.params.id);

      const application =
        await this.disapproveApplicationUseCase.execute({
          establishmentId,
          applicationId
        });

      res.json({
        message: "Application disapproved",
        application
      });
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ error: err.message });
    }
  };
}
