import express, { Express } from "express";
export const app: Express = express();
import dotenv from "dotenv";
import cors from "cors";

app.use(express.json());
dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Refresh", "Verify", "Origin", "Accept"],
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

import { router as userRouter } from "./routes/user.route";
import { errorMiddleware } from "./middlewares/errorMiddleware";

app.use("/users", userRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`running on port ${PORT}`);
});
