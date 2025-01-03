import { body } from "express-validator";

export const emailValidate = body("email")
  .notEmpty()
  .withMessage("이메일을 입력해주세요.")
  .isEmail()
  .withMessage("이메일 형식을 맞춰주세요.");

export const nameValidate = body("name")
  .notEmpty()
  .withMessage("이름을 입력해주세요.")
  .isLength({ min: 2, max: 10 })
  .withMessage("이름은 2자 ~ 10자로 입력해주세요.");

export const passwordValidate = body("password")
  .notEmpty()
  .withMessage("비밀번호를 입력해주세요.")
  .isLength({ min: 8 })
  .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
  .withMessage("비밀번호는 영문, 숫자를 포함해야 합니다.");

export const registerValidate = [emailValidate, nameValidate, passwordValidate];
export const loginValidate = [emailValidate, passwordValidate];
