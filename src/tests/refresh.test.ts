import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import { findRefreshToken } from "../models/user.model";
import { StatusCodes } from "http-status-codes";

jest.mock("../models/user.model", () => ({
  findRefreshToken: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(() => "newAccessToken"),
}));

const ERROR_MESSAGES = {
  INVALID_REFRESH_TOKEN: "유효하지 않은 Refresh Token입니다.",
  NO_REFRESH_TOKEN: "Refresh Token이 없습니다.",
};

const postRefresh = (token?: string) => {
  const cookie = token ? `refreshToken=${token}` : undefined;
  return request(app)
    .post("/api/v1/users/refresh")
    .set("Cookie", cookie || "");
};

const mockRefreshToken = "validRefreshToken";
const mockPayload = { id: 1, email: "test@example.com" };

describe("POST /api/v1/users/refresh", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("200, Refresh Token이 유효할 때 Access Token 재발급", async () => {
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
    (findRefreshToken as jest.Mock).mockResolvedValue({ token: mockRefreshToken });

    const response = await postRefresh(mockRefreshToken);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.message).toBe("Access Token 재발급 성공");
    expect(response.body.accessToken).toBe("newAccessToken");
    expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, expect.any(String));
    expect(findRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });

  it("401, 유효하지 않은 Refresh Token", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await postRefresh(mockRefreshToken);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, expect.any(String));
  });

  it("401, Refresh Token이 저장되지 않아 재발급 실패", async () => {
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
    (findRefreshToken as jest.Mock).mockResolvedValue(null);

    const response = await postRefresh(mockRefreshToken);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    expect(findRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });

  it("400, Refresh Token이 없어 재발급 실패", async () => {
    const response = await postRefresh();

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ msg: ERROR_MESSAGES.NO_REFRESH_TOKEN })])
    );
  });
});
