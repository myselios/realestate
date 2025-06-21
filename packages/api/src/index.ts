import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
