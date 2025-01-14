import express, { Router } from "express";
import { wrapAsyncController } from "../utils/wrapAsyncController";
import { accessTokenValidate } from "../middlewares/authMiddleware";
import { getAnswer, getChats, getHistory, uploadFile } from "../controllers/chat.controller";
import { chatHistoryValidate, chatValidate, fileValidate, typeValidate } from "../validators/chat.validator";
import { validate } from "../middlewares/validator";
import { upload } from "../middlewares/uploadMiddleware";

export const router: Router = express.Router();

router.get("/", accessTokenValidate, typeValidate, validate, wrapAsyncController(getHistory));

router.get("/:chatId", accessTokenValidate, ...chatHistoryValidate, validate, wrapAsyncController(getChats));

router.post(
  "/custom",
  accessTokenValidate,
  upload.single("file"),
  fileValidate,
  validate,
  wrapAsyncController(uploadFile)
);

router.post("/:chatId", accessTokenValidate, ...chatValidate, validate, wrapAsyncController(getAnswer));
