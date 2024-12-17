"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { update } from "@/auth";
import { db } from "@/lib/prismadb";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth/auth";
import { generateVerificationToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/auth/mail";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "未经授权的" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "未经授权的" }
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "电子邮件已在使用中!" }
    }

    const verificationToken = await generateVerificationToken(
      values.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "发送验证邮件!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "不正确的密码!" };
    }

    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    }
  });

  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    }
  });

  return { success: "设置更新!" }
}