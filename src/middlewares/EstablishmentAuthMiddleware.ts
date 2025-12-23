import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

declare global {
  namespace Express {
    interface Request {
      establishmentId?: string;
    }
  }
}

export const EnsureEstablishmentAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string, role: string};
    if (payload.role !== "establishment") {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.log('token role: ',payload.role)
    req.establishmentId = payload.id;
    req.role = payload.role
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
