import { ADMIN_PASSWORD } from "./config/env";
import express, { Request, Response } from "express";
import vagasRouter from "./routes/vagas";
import adminRoutes from "./routes/admin";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send("API Vagas Poço Fundo - Online 🚀!");
});

const apiRouter = express.Router();

apiRouter.use("/vagas", vagasRouter);
apiRouter.use("/admin", adminRoutes);

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
