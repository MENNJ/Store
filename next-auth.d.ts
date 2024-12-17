// 导入UserRole类型和NextAuth库
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

// 定义扩展用户类型，继承DefaultSession中的user类型，并添加role、isTwoFactorEnabled和isOAuth属性
export type ExtendedUser = DefaultSession["user"] & {
  UserId: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

// 声明模块，扩展NextAuth中的Session类型，将user属性替换为ExtendedUser类型
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
