"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/prismadb";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/auth/mail";
import { generateVerificationToken } from "@/lib/auth/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "无效的字段!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "电子邮件已在使用中!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "确认邮件已发送!" };
};
