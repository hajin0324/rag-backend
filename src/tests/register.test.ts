import request from "supertest";
import { app } from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

jest.mock("../models/user.model", () => ({
  createUser: jest.fn(),
  findUser: jest.fn(),
}));

const { createUser, findUser } = require("../models/user.model");

const postRegister = (data: Record<string, any>) => {
  return request(app).post("/api/v1/users/register").send(data);
};

const validUserData = {
  email: "test@example.com",
  name: "Test User",
  password: "Password1!",
};

describe("POST /api/v1/users/register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("201, 유저 생성", async () => {
    findUser.mockResolvedValue(null);
    createUser.mockResolvedValue(validUserData);

    const response = await postRegister(validUserData);

    expect(response.status).toBe(201);
    expect(findUser).toHaveBeenCalledWith(validUserData.email);
    expect(createUser).toHaveBeenCalledWith(validUserData.email, validUserData.name, expect.any(String));
  });

  it("400, 이미 가입된 이메일", async () => {
    findUser.mockResolvedValue({ ...validUserData });

    const response = await postRegister(validUserData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("이미 가입된 이메일입니다.");
    expect(findUser).toHaveBeenCalledWith(validUserData.email);
    expect(createUser).not.toHaveBeenCalled();
  });

  it("400, 형식에 맞지 않는 정보", async () => {
    const response = await postRegister({
      email: "test",
      name: "t",
      password: "test12",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "이메일 형식을 맞춰주세요." }),
        expect.objectContaining({ msg: "이름은 2자 ~ 10자로 입력해주세요." }),
        expect.objectContaining({ msg: "비밀번호는 최소 8자 이상이어야 합니다." }),
      ])
    );
  });

  it("500, 서버 에러", async () => {
    findUser.mockRejectedValue(new Error("Database error"));

    const response = await postRegister(validUserData);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});
