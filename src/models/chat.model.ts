import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findStudyChatHistory = async (userId: number) => {
  return await prisma.studyChatHistory.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findStudyChats = async (historyId: number) => {
  return await prisma.studyChat.findMany({
    where: { historyId },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
};

export const findCustomChatHistory = async (userId: number) => {
  return await prisma.customChatHistory.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findCustomChats = async (historyId: number) => {
  return await prisma.customChat.findMany({
    where: { historyId },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
};

export const findCustomInfo = async (userId: number) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      custom: true,
    },
  });
};

export const saveStudyChat = async (chatId: number, role: string, content: string) => {
  return await prisma.studyChat.create({
    data: { historyId: chatId, role, content },
  });
};

export const saveCustomChat = async (chatId: number, role: string, content: string) => {
  return await prisma.studyChat.create({
    data: { historyId: chatId, role, content },
  });
};
