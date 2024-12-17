"use server";

import { db } from "@/lib/prismadb";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificiation-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "令牌不存在!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "令牌已过期!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "电子邮件不存在!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      email: existingToken.email,
    }
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "电子邮件验证!" };
};
