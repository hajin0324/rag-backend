import { query } from "express-validator";

export const typeValidate = query("type")
  .notEmpty()
  .withMessage("챗봇 유형을 입력해주세요.")
  .isIn(["study", "custom"])
  .withMessage("챗봇 유형은 'study' 또는 'custom'입니다.");
