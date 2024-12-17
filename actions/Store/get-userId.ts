import { db } from "@/lib/prismadb";

const getUser = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export default getUser;
