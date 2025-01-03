import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteRefreshToken,
  deleteRefreshTokenById,
  findRefreshToken,
  findUser,
  saveRefreshToken,
} from "../models/user.model";
import { HttpException } from "../utils/httpException";
import { StatusCodes } from "http-status-codes";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.REFRESH_JWT_SECRET) {
  throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, "Not defined in environment variables");
}

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

export const registerUser = async (email: string, name: string, password: string) => {
  const user = await findUser(email);

  if (user) {
    throw new HttpException(StatusCodes.BAD_REQUEST, "이미 가입된 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return await createUser(email, name, hashedPassword);
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUser(email);

  if (!user) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  await deleteRefreshTokenById(user.id);

  const accessToken = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ email: user.email, id: user.id }, REFRESH_JWT_SECRET, { expiresIn: "7d" });

  await saveRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as { id: number; email: string };
  const token = await findRefreshToken(refreshToken);

  if (!token) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "유효하지 않은 Refresh Token입니다.");
  }

  return jwt.sign({ id: payload.id, email: payload.email }, JWT_SECRET, { expiresIn: "1h" });
};

export const logoutUser = async (refreshToken: string) => {
  await deleteRefreshToken(refreshToken);
};
