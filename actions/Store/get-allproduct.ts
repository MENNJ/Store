import { db } from "@/lib/prismadb";


const allProduct = async () => {
    try {
        const storesWithProducts = await db.store.findMany({
            include: {
                products: {
                    include: {
                        images: true,
                    },
                },
            },
        });
        const allProducts = storesWithProducts.flatMap(store =>
            store.products.map(product => ({
                ...product,
                price: product.price.toString(),
            }))
        );
        return allProducts;
    } catch (error) {
        console.error("获取商店和产品时出错:", error);
    } finally {
        await db.$disconnect();
    }
};

export default allProduct;
