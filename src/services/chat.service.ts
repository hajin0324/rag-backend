import { StatusCodes } from "http-status-codes";
import {
  findCustomChatHistory,
  findCustomChats,
  findCustomInfo,
  findStudyChatHistory,
  findStudyChats,
  saveCustomChat,
  saveStudyChat,
} from "../models/chat.model";
import { ChatHistory, ChatMessage } from "../types/chat";
import { HttpException } from "../utils/httpException";
import { callGPTAPI } from "../utils/gpt";
import { createChromaCollection, searchChromaDB } from "../utils/vectorDB";

export const getChatHistory = async (userId: number, type: string) => {
  let history: ChatHistory[] = [];
  let chats: ChatMessage[] = [];

  if (type === "study") {
    history = await findStudyChatHistory(userId);

    if (history.length > 0) {
      chats = await findStudyChats(history[0].id);
    }
  } else if (type === "custom") {
    history = await findCustomChatHistory(userId);

    if (history.length > 0) {
      chats = await findCustomChats(history[0].id);
    }
  }

  return { history, chats };
};

export const generateResponse = async (userId: number, type: string, chatId: number, question: string) => {
  const history = type === "study" ? await findStudyChatHistory(userId) : await findCustomChatHistory(userId);
  const isValidChat = history.some((chat) => chat.id === chatId);

  if (!isValidChat) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "사용자와 chatId가 일치하지 않습니다.");
  }

  const chats = type === "study" ? await findStudyChats(chatId) : await findCustomChats(chatId);
  const messages = chats.map((msg) => `${msg.role}: ${msg.content}`).join(" ");

  let vectorDB = "default";
  if (type === "custom") {
    const user = await findCustomInfo(userId);
    vectorDB = user.custom;
  }

  const searchResults = await searchChromaDB(vectorDB, question, messages);
  const context = searchResults.metadatas.map((metadata: any) => metadata.content).join(" ");
  const response = await callGPTAPI(question, context);

  if (type === "study") {
    await saveStudyChat(chatId, "user", question);
    await saveStudyChat(chatId, "bot", response);
  } else if (type === "custom") {
    await saveCustomChat(chatId, "user", question);
    await saveCustomChat(chatId, "bot", response);
  }

  return { role: "bot", content: response };
};
