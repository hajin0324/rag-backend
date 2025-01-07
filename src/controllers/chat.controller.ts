import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TokenRequest } from "../middlewares/authMiddleware";
import { generateResponse, getChatHistory } from "../services/chat.service";

export const getHistory = async (req: Request, res: Response) => {
  const userId = (req as TokenRequest).token?.id;
  const type = req.query.type as string;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "올바르지 않은 사용자 입니다." });
    return;
  }

  const { history, chats } = await getChatHistory(userId, type);

  res.status(StatusCodes.OK).json({
    history: history,
    chats: chats,
  });
};

export const getAnswer = async (req: Request, res: Response) => {
  const userId = (req as TokenRequest).token?.id;
  const type = req.query.type as string;
  const chatId = parseInt(req.params.chatId);
  const question = req.body.question;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "올바르지 않은 사용자 입니다." });
    return;
  }

  const answer = await generateResponse(userId, type, chatId, question);

  res.status(StatusCodes.OK).json(answer);
};
