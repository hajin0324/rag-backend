import { body, param, query } from "express-validator";
import { HttpException } from "../utils/httpException";
import { StatusCodes } from "http-status-codes";

export const typeValidate = query("type")
  .notEmpty()
  .withMessage("챗봇 유형을 입력해주세요.")
  .isString()
  .withMessage("챗봇 유형은 문자열이어야 합니다.")
  .isIn(["study", "custom"])
  .withMessage("챗봇 유형은 'study' 또는 'custom'입니다.");

export const chatIdValidate = param("chatId")
  .notEmpty()
  .withMessage("chatId를 입력해주세요")
  .isInt({ gt: 0 })
  .withMessage("chatId는 양의 정수여야 합니다.");

export const questionValidate = body("question").notEmpty().withMessage("질문을 입력해주세요.");

export const fileValidate = body("file")
  .custom((_, { req }) => {
    if (!req.file) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "파일이 업로드되지 않았습니다.");
    }

    const fileType = req.file.mimetype;
    if (!["text/csv", "application/vnd.ms-excel"].includes(fileType)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "CSV 형식 파일을 업로드 해주세요.");
    }

    return true;
  })
  .withMessage("파일 업로드 실패");

export const chatValidate = [typeValidate, chatIdValidate, questionValidate];

export const chatHistoryValidate = [typeValidate, chatIdValidate];
