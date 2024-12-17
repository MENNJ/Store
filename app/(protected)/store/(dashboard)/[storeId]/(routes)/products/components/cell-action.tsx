"use client"

import axios from "axios";

import { Copy, Edit, MoreHorizontalIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProductColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";


interface CellActionProps {
    data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    if (!params) return null    
    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast({
            description: "复制成功",
            action: (
                <ToastAction altText="Goto schedule to undo">知道了</ToastAction>
            ),
        })
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${data.id}`);
            router.refresh();
            toast({
                description: "产品被删除",
                action: (
                    <ToastAction altText="Goto schedule to undo">知道了</ToastAction>
                ),
            })

        } catch (error) {
            toast({
                variant: "destructive",
                description: "出错了，请稍后再试.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
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
                        <span className="sr-only">Open menu</span>
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
                    <DropdownMenuItem onClick={() => router.push(`/store/${params.storeId}/products/${data.id}`)}>
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