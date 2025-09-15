import { ADMIN_PASSWORD } from "./config/env";
import express, { Request, Response } from "express";
import vagasRouter from "./routes/vagas";
import adminRoutes from "./routes/admin";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";


const app = express();
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});


app.use(cors(
  {
    credentials: true,
    origin: process.env.NODE_ENV !== "production" ? 'http://localhost:5173' : 'https://vagas-pf-api.onrender.com'
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

apiRouter.use("/vagas", vagasRouter);
apiRouter.use("/admin", adminRoutes);

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
