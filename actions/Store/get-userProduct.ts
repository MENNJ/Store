import { db } from "@/lib/prismadb";

const getUserProducts = async (storeId: string) => {
    const products = await db.product.findMany({
        where: {
            userId: storeId,
            isArchived: false,
        },
        include: {
            images: true,
        },
    });

    return products.map((product) => ({
        ...product,
        price: product.price.toString(),
        images: product.images.map(image => ({
            ...image,
            url: image.url, 
        })),
    }));
};

export default getUserProducts;
