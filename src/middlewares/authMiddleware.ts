import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../utils/httpException";
import dotenv from "dotenv";

dotenv.config();

interface DecodedJWT {
  id: number;
  email: string;
}

export interface TokenRequest extends Request {
  token?: DecodedJWT;
}

export const accessTokenValidate = (req: TokenRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Access token이 제공되지 않았습니다.");
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET!) as DecodedJWT;
    req.token = decoded;
    next();
  } catch (error) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "잘못된 Access token입니다.");
  }
};
