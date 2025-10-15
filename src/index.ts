import { ADMIN_PASSWORD } from "./config/env";
import express, { Request, Response } from "express";
import vacancyRoutes from "./routes/vacancy";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth"
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import profileRoutes from "./routes/profile";
import { errorMiddleware } from "./middlewares/ErrorMiddleware";

const app = express();
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});


app.use(cors(
  {
    credentials: true,
    origin: process.env.NODE_ENV !== "production" ? 'http://192.168.0.122:5173' : 'https://vagaspocofundo.netlify.app'
  }
));
app.use(cookieParser())

app.use(express.json());

morgan.token("date", () => new Date().toISOString());
app.use(
  morgan(':date :method :url :status :response-time ms - :res[content-length]')
);

app.get("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send("API Vagas Poço Fundo - Online 🚀!");
});

const apiRouter = express.Router();

apiRouter.use("/vacancy", vacancyRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/profile", profileRoutes);

app.use("/api", apiRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
