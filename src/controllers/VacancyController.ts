import { Request, Response } from "express";
import { CreateVacancyUseCase } from "../usecases/vacancy/createNewVacancy";
import { ListVacanciesUseCase } from "../usecases/vacancy/listVacancies";
import { UpdateVacancyUseCase } from "../usecases/vacancy/updateVacancy";
import { DeleteVacancyUseCase } from "../usecases/vacancy/deleteVacancy";
import { ListVacanciesByEstablishmentUseCase } from "../usecases/vacancy/listVacancyByEstablishment";
import { Prisma } from "../generated/client";

export class VacancyController {
  constructor(
    private createVacancyUseCase: CreateVacancyUseCase,
    private listVacanciesUseCase: ListVacanciesUseCase,
    private updateVacancyUseCase: UpdateVacancyUseCase,
    private deleteVacancyUseCase: DeleteVacancyUseCase,
    private listVacanciesByEstablishmentUseCase: ListVacanciesByEstablishmentUseCase
  ) {}

  async create(req: Request, res: Response) {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });


    console.log(req.userId)

    try {
      const data = req.body;
      const jobData: Prisma.JobCreateInput = {
        ...data,
        establishment: { connect: { id: Number(req.userId) } },
      };

      const job = await this.createVacancyUseCase.execute(jobData);
      return res.status(201).json(job);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create job" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 0;
      const pageSize = 30;

      const result = await this.listVacanciesUseCase.execute(page, pageSize);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to list jobs" });
    }
  }

  async listByEstablishment(req: Request, res: Response) {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
    try {
      const jobs = await this.listVacanciesByEstablishmentUseCase.execute(Number(req.userId));
      return res.json(jobs);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to list jobs" });
    }
  }

  async update(req: Request, res: Response) {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const { jobId, ...rest } = req.body;
      if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job ID" });

      const job = await this.updateVacancyUseCase.execute(Number(jobId), rest);
      return res.json(job);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update job" });
    }
  }

  async delete(req: Request, res: Response) {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const jobId = Number(req.body.jobID);
      console.log('job Id: ', req.body)
      if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job ID" });

      await this.deleteVacancyUseCase.execute(jobId);
      return res.json({ message: "Job deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete job" });
    }
  }
}
