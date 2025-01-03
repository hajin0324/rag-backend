import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (email: string, name: string, hashedPassword: string) => {
  return await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
};

export const findUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });
};

export const saveRefreshToken = async (userId: number, token: string) => {
  return prisma.refreshToken.create({
    data: { userId, token },
  });
};

export const findRefreshToken = async (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
};

export const deleteRefreshToken = async (token: string) => {
  return prisma.refreshToken.delete({
    where: { token },
  });
};

export const deleteRefreshTokenById = async (userId: number) => {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
