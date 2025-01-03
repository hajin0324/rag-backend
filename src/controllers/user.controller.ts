import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { loginUser, registerUser } from "../services/user.service";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  const user = await registerUser(email, name, password);

  res.status(StatusCodes.CREATED).end();
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await loginUser(email, password);

  res.status(StatusCodes.OK).json({ message: "로그인 성공", accessToken, refreshToken });
};
