"use client"

import axios from "axios";
import { Copy, Edit, MoreHorizontalIcon, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BillboardColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";


interface CellActionProps {
    data: BillboardColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const { toast } = useToast()
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast({
            description: "复制成功",
            action: (
                <ToastAction altText="Goto schedule to undo">收回</ToastAction>
            ),
        })
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            router.refresh();
            toast({
                description: "广告牌已删除.",
                action: (
                    <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                ),
            })
        } catch (error) {
            toast({
                variant: "destructive",
                description: "确保你先用公告牌删除了所有类别.",
                action: <ToastAction altText="Try again">收回</ToastAction>,
            })
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">打开菜单</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        操作
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        复制 Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/store/${params.storeId}/billboards/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        更新
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        删除
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}