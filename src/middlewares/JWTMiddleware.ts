import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { JWT_SECRET } from "../config/env";


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError("Token not provided", 401);

  const [, token] = authHeader.split(" ");


  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { id: number };
    req.userId = decoded.id.toString();
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError("Session expired, please login again", 401);
    }
    console.log(err)
    throw new AppError("Invalid token", 401);
    

  }
}
