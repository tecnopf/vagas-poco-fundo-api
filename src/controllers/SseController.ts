import { Request, Response } from "express";
import { SseService } from "../services/SseService"; 

const sseService = new SseService();

export class SseController {
  connectUser = (req: Request, res: Response) => {
    const userId = Number(req.userId);
    sseService.connectUser(userId, res);
  };

  connectEstablishment = (req: Request, res: Response) => {
    const establishmentId = Number(req.establishmentId);
    sseService.connectEstablishment(establishmentId, res);
  };
}
