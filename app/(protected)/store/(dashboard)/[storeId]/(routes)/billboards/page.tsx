import { format } from "date-fns"
import { type Metadata } from "next"

export const metadata: Metadata = {
    title: "Billboards",
    description: "Billboards",
}

import {db} from "@/lib/prismadb"
import { BillboardClient } from "./components/client"
import { BillboardColumn } from "./components/columns"

const BillboardsPage = async ({
    params
}: {
    params: {
        storeId: string}
}) => {
    const billboards = await db.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
             createdAt: 'desc'
        }
    })

const formattedBillboards : BillboardColumn[]=billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt:format(item.createdAt, "dd/MM/yyyy HH:mm:ss")
}))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient  data={formattedBillboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage