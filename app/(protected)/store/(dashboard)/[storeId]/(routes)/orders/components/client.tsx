"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    return (
        <>
            <Heading
                title={`订单 (${data.length})`}
                description="为您的商店管理订单"
            />
            <Separator />
            <DataTable searchKey="products"columns={columns} data={data}
            />
        </>
    )
}