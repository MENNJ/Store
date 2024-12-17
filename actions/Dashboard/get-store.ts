import { db } from "@/lib/prismadb";

export const getStore = async (storeId: string) => {
  const store = await db.store.findFirst({
    where: {
      id: storeId,
    },
    select: {
      name: true,
    },
  });

  return store?.name;
};
