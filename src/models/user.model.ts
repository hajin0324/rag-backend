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
      email: true,
      password: true,
    },
  });
};
