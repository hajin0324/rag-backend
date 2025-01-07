import { body, param, query } from "express-validator";

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

export const chatValidate = [typeValidate, chatIdValidate, questionValidate];
