import { db } from "@/lib/prismadb";

export const getStoreCreationHours = async (storeId: string) => {

    const store = await db.store.findUnique({
        where: {
            id: storeId,
        },
        select: {
            createdAt: true,
        },
    });

    if (!store) {
        throw new Error("Store not found");
    }

    const createdAt = store.createdAt;
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - createdAt.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);  

    return Math.floor(diffInHours);
};
