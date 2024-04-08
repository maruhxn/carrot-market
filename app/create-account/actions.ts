"use server";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("fuck");
const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string", // 기대한 타입과 다른 타입을 보낸 경우 나타나는 메시지,
        required_error: "Where is my username?", // 해당 값을 보내지 않을 경우 나타나는 메시지
      })
      .min(3, "Way too short!!")
      .max(10, "That is too long!!")
      .refine(checkUsername, "No fuck allowed"), // 비즈니스 로직을 통한 검증 가능,
    email: z.string().email(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
  })
  //   .refine(checkPassword, "Both passwords should be the same!");
  .refine(checkPassword, {
    message: "Both passwords should be the same!",
    path: ["confirmPassword"],
  });
/**
 * 객체에 대하여 refinement를 수행할 수도 있으며, 여기서 발생한 에러는 formErrors에 담긴다.
 * 하지만, 메시지가 아닌 객체를 두번째 인자로 보내주어 커스텀할 수 있다.
 * {message: 메시지, path: 에러의 주인}
 */

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = formSchema.safeParse(data); // parse와 달리 error를 throw 하지 않는다.
  if (!result.success) {
    return result.error.flatten();
  }
}
