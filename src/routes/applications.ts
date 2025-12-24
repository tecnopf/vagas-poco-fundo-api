import { Router } from "express";
import { ApplicationsController } from "../controllers/ApplicationController"; 
import { PrismaApplicationRepository } from "../infrastructure/ApplicationRepositoryMySQL";
import { ApplyToJobUseCase } from "../usecases/applications/ApplyToJobUseCase";
import { ListUserApplicationsUseCase } from "../usecases/applications/ListUserApplicationsUseCase";
import { ListEstablishmentApplicationsUseCase } from "../usecases/applications/ListEstablishmentApplicationsUseCase";
import { ApproveApplicationUseCase } from "../usecases/applications/ApproveApplicationsUseCase";
import { DisapproveApplicationUseCase } from "../usecases/applications/DisapproveApplicationsUseCase";
import { UserRepositoryMySQL } from "../infrastructure/UserRepositoryMySQL";

import { PrismaVacancyRepository } from "../infrastructure/VacancyRepositoryMySQL";
import { PrismaNotificationRepository } from "../infrastructure/NotificationRepositoryMySQL";
import { SseService } from "../services/SseService";
import { FtpResumeStorageService } from "../services/ResumeStorageService";

import multer from "multer";

import { EnsureUserAuth } from "../middlewares/UserAuthMiddleware";

const upload = multer();

const applicationsRoutes = Router();

const applicationRepo = new PrismaApplicationRepository()
const notificationRepository = new PrismaNotificationRepository();

const sseService = new SseService();
const resumeStorageService = new FtpResumeStorageService();

const listUserUC = new ListUserApplicationsUseCase(applicationRepo)
const listEstablishmentUC = new ListEstablishmentApplicationsUseCase(applicationRepo)
const approveUC = new ApproveApplicationUseCase(applicationRepo, notificationRepository, sseService)
const disapproveUC = new DisapproveApplicationUseCase(applicationRepo, notificationRepository, sseService)

const vacancyRepository = new PrismaVacancyRepository();

const applyToJobUseCase = new ApplyToJobUseCase(
  vacancyRepository,
  notificationRepository,
  sseService,
  resumeStorageService
);

const controller = new ApplicationsController(
  applyToJobUseCase,
  listUserUC,
  listEstablishmentUC,
  approveUC,
  disapproveUC,
  resumeStorageService,
  vacancyRepository,
  new UserRepositoryMySQL
);

applicationsRoutes.post(
  "/apply",
  EnsureUserAuth,
  upload.single("file"),
  controller.apply
);

export default applicationsRoutes;
