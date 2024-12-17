"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/auth/mail";
import { generatePasswordResetToken } from "@/lib/auth/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "无效电子邮件!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "没有找到电子邮件!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "重置邮件已发送!" };
}