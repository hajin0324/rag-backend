import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TokenRequest } from "../middlewares/authMiddleware";
import { createCustomDB, generateResponse, getChatHistory, getChatMessages } from "../services/chat.service";

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

export const getChats = async (req: Request, res: Response) => {
  const userId = (req as TokenRequest).token?.id;
  const type = req.query.type as string;
  const chatId = parseInt(req.params.chatId);

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "올바르지 않은 사용자 입니다." });
    return;
  }

  const chats = await getChatMessages(userId, type, chatId);

  res.status(StatusCodes.OK).json(chats);
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

export const uploadFile = async (req: Request, res: Response) => {
  const userId = (req as TokenRequest).token?.id;
  const filePath = req.file!.path;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "올바르지 않은 사용자 입니다." });
    return;
  }

  await createCustomDB(userId, filePath);

  res.status(StatusCodes.OK).end();
};
