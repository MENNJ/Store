"use client";
import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { ProductColumn, columns } from "./columns";


interface ProductClientProps {
    data: ProductColumn[]
}



export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();
    if (!params) return null;
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`产品 (${data.length})`}
                    description="为您的商店管理产品"
                />
                <Button onClick={() => router.push(`/store/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加新产品
                </Button>
            </div>
            <Separator />
            <DataTable
                searchKey="name"
                columns={columns}
                data={data}
            />
            <Heading title="接口" description="产品的接口" />
            <Separator />
            <ApiList entityName="products" entityIdName="productId" />
        </>
    )
}