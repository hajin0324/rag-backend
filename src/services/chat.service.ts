import { findCustomChatHistory, findCustomChats, findStudyChatHistory, findStudyChats } from "../models/chat.model";
import { ChatHistory, ChatMessage } from "../types/chat";

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
