import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError"; 

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err.message)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err); 
  return res.status(500).json({
    message: "Internal server error",
  });
}
