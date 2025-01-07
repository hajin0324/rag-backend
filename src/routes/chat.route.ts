import express, { Router } from "express";
import { wrapAsyncController } from "../utils/wrapAsyncController";
import { accessTokenValidate } from "../middlewares/authMiddleware";
import { getAnswer, getHistory } from "../controllers/chat.controller";
import { chatValidate, typeValidate } from "../validators/chat.validator";
import { validate } from "../middlewares/validator";

export const router: Router = express.Router();

router.get("/", accessTokenValidate, typeValidate, validate, wrapAsyncController(getHistory));

router.post("/:chatId", accessTokenValidate, ...chatValidate, validate, wrapAsyncController(getAnswer));
