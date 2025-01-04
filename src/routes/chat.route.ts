import express, { Router } from "express";
import { wrapAsyncController } from "../utils/wrapAsyncController";
import { accessTokenValidate } from "../middlewares/authMiddleware";
import { getHistory } from "../controllers/chat.controller";
import { typeValidate } from "../validators/chat.validator";
import { validate } from "../middlewares/validator";

export const router: Router = express.Router();

router.get("/", accessTokenValidate, typeValidate, validate, wrapAsyncController(getHistory));
