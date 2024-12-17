"use server";

import { currentRole } from "@/lib/auth/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: "允许的服务器操作!" };
  }

  return { error: "禁止的服务器操作!" }
};
