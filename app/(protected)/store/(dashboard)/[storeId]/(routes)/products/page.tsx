import { format } from "date-fns"
import { db } from "@/lib/prismadb"
import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"
import { formatter } from "@/lib/utils"

const ProductsPage = async ({
    params
}: {
    params: {
        storeId: string
    }
}) => {
    const products = await db.product.findMany({
        where: {
            storeId: params.storeId
        },

        orderBy: {
            createdAt: 'desc'
        }
    })
    console.log(products);

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        detailed: item.detailed,
        createdAt: format(item.createdAt, "dd/MM/yyyy HH:mm:ss")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}

export default ProductsPage