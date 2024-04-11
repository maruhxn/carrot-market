"use server";
import {
  PASSWORD_CONFIRM_FAIL_MSG,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR_MSG,
} from "@/lib/constants";
import db from "@/lib/db";
import { saveLoginSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

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
      .toLowerCase()
      .trim(),
    //   .transform((username) => "transformedPassword")
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MSG),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"], // 설정 안 하면 formErrors로 처리됨.
        fatal: true, // fatal error로 설정하고, z.NEVER를 반환하면, 뒤에 다른 refine이 있어도, 실행되지 않는다.
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"], // 설정 안 하면 formErrors로 처리됨.
        fatal: true, // fatal error로 설정하고, z.NEVER를 반환하면, 뒤에 다른 refine이 있어도, 실행되지 않는다.
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: PASSWORD_CONFIRM_FAIL_MSG,
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

  const result = await formSchema.safeParseAsync(data);
  // parse와 달리 safeParse error를 throw 하지 않는다. safeParseAsync는 async 추가. (비즈니스 로직이 async/await릂 포함.)
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashsedPwd = await bcrypt.hash(result.data.password, 12); // 해싱 알고리즘 12번 실행
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashsedPwd,
      },
      select: {
        id: true,
      },
    });
    await saveLoginSession(user.id);
    redirect("/profile");
  }
}
