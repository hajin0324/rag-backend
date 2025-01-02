import express, { Router } from "express";
import { validate } from "../middlewares/validator";
import { registerValidate } from "../validators/users.validator";
import { addUser } from "../controllers/user.controller";
import { wrapAsyncController } from "../utils/wrapAsyncController";

export const router: Router = express.Router();

router.post("/register", ...registerValidate, validate, wrapAsyncController(addUser));
