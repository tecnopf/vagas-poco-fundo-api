import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string
    }
  }
}


export const EnsureUserAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
    if (payload.role !== "user") {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.userId = payload.id;
    req.role = payload.role
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
