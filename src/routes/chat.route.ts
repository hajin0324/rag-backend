import express, { Router } from "express";
import { wrapAsyncController } from "../utils/wrapAsyncController";
import { accessTokenValidate } from "../middlewares/authMiddleware";
import { getAnswer, getChats, getHistory } from "../controllers/chat.controller";
import { chatHistoryValidate, chatValidate, typeValidate } from "../validators/chat.validator";
import { validate } from "../middlewares/validator";

export const router: Router = express.Router();

router.get("/", accessTokenValidate, typeValidate, validate, wrapAsyncController(getHistory));

router.get("/:chatId", accessTokenValidate, ...chatHistoryValidate, validate, wrapAsyncController(getChats));

router.post("/:chatId", accessTokenValidate, ...chatValidate, validate, wrapAsyncController(getAnswer));
