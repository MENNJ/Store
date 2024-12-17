"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/prismadb";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "无效的字段!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "无效的令牌!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "令牌已过期!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "电子邮件不存在!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "密码已经更新请返回登录!" };
};
