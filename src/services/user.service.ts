import bcrypt from "bcrypt";
import { createUser, findUser } from "../models/user.model";

const SALT_ROUNDS = 10;

export const registerUser = async (email: string, name: string, password: string) => {
  const user = await findUser(email);

  if (user) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return await createUser(email, name, hashedPassword);
};
