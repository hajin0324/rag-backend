import express, { Router } from "express";
import { validate } from "../middlewares/validator";
import { loginValidate, registerValidate } from "../validators/users.validator";
import { addUser, login } from "../controllers/user.controller";
import { wrapAsyncController } from "../utils/wrapAsyncController";

export const router: Router = express.Router();

router.post("/register", ...registerValidate, validate, wrapAsyncController(addUser));

router.post("/login", ...loginValidate, validate, wrapAsyncController(login));
