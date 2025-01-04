import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app: Express = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const API_PREFIX = "/api/v1";

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Refresh", "Verify", "Origin", "Accept"],
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

import { router as userRouter } from "./routes/user.route";
import { router as chatRouter } from "./routes/chat.route";
import { errorMiddleware } from "./middlewares/errorMiddleware";

app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/chats`, chatRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`running on port ${PORT}`);
});
