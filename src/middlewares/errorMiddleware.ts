import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../utils/httpException";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;

  console.error("Error", error.message);
  res.status(status).json({
    status: status,
    message: error.message,
  });

  next();
};
