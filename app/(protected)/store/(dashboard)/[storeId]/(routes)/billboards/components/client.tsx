"use client";
import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`广告牌 (${data.length})`}
                    description="为你的商店管理广告牌"
                />
                <Button onClick={() => router.push(`/store/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加新广告牌
                </Button>
            </div>
            <Separator />
            <DataTable
                searchKey="label"
                columns={columns}
                data={data}
            />
            <Heading title="接口" description="广告牌的接口" />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
    )
}