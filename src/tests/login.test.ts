import request from "supertest";
import { app } from "../app";

jest.mock("../models/user.model", () => ({
  findUser: jest.fn(),
  deleteRefreshTokenById: jest.fn(),
  saveRefreshToken: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "accessToken"),
}));

const { findUser, deleteRefreshTokenById, saveRefreshToken } = require("../models/user.model");
const { compare } = require("bcrypt");

const postLogin = (data: Record<string, any>) => {
  return request(app).post("/api/v1/users/login").send(data);
};

const loginInfo = {
  email: "test@example.com",
  password: "Password1!",
};

const mockUser = {
  id: 1,
  email: "test@example.com",
  password: "hashedPassword",
};

describe("POST /api/v1/users/login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("200, 로그인 성공", async () => {
    findUser.mockResolvedValue(mockUser);
    compare.mockResolvedValue(true);

    const response = await postLogin(loginInfo);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("로그인 성공");
    expect(response.body.accessToken).toBe("accessToken");
    expect(findUser).toHaveBeenCalledWith(loginInfo.email);
    expect(compare).toHaveBeenCalledWith(loginInfo.password, mockUser.password);
    expect(saveRefreshToken).toHaveBeenCalled();
  });

  it("200, 로그인 성공 시 이전 토큰 삭제", async () => {
    findUser.mockResolvedValue(mockUser);
    compare.mockResolvedValue(true);

    const response = await postLogin(loginInfo);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("로그인 성공");
    expect(deleteRefreshTokenById).toHaveBeenCalledWith(mockUser.id);
    expect(saveRefreshToken).toHaveBeenCalledWith(mockUser.id, "accessToken");
  });

  it("401, 잘못된 이메일", async () => {
    findUser.mockResolvedValue(null);
    const response = await postLogin({
      ...loginInfo,
      email: "wrong@example.com",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
    expect(findUser).toHaveBeenCalledWith("wrong@example.com");
  });

  it("401, 잘못된 비밀번호", async () => {
    findUser.mockResolvedValue(mockUser);
    compare.mockResolvedValue(false);

    const response = await postLogin({
      ...loginInfo,
      password: "WrongPassword1!",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
    expect(compare).toHaveBeenCalledWith("WrongPassword1!", mockUser.password);
  });

  it("400, 유효성 검사 실패", async () => {
    const response = await postLogin({
      email: "invalid-email",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "이메일 형식을 맞춰주세요." }),
        expect.objectContaining({ msg: "비밀번호는 최소 8자 이상이어야 합니다." }),
      ])
    );
  });

  it("500, 서버 에러", async () => {
    findUser.mockRejectedValue(new Error("Database error"));

    const response = await postLogin(loginInfo);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});
