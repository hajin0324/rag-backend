import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/user.service";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  const user = await registerUser(email, name, password);

  res.status(StatusCodes.CREATED).end();
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({ message: "로그인 성공", accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = await refreshAccessToken(refreshToken);

  res.status(StatusCodes.OK).json({ message: "Access Token 재발급 성공", accessToken });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  await logoutUser(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(StatusCodes.OK).json({ message: "로그아웃 성공" });
};
