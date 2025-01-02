import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { registerUser } from "../services/user.service";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  const user = await registerUser(email, name, password);

  res.status(StatusCodes.CREATED).end();
};
