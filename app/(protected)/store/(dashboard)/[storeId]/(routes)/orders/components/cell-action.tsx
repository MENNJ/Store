"use client"

import axios from "axios";
import { Copy, MoreHorizontalIcon, Trash, Truck } from "lucide-react";
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
import { OrderColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: OrderColumn;
    userRole: "buyer" | "seller";
    isShipDisabled: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({
    data,
    userRole,
    isShipDisabled
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
            await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
            router.refresh();
            toast({
                description: "订单已退款.",
                action: (
                    <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                ),
            })
        } catch (error) {
            toast({
                variant: "destructive",
                description: "发生错误.",
                action: <ToastAction altText="Try again">收回</ToastAction>,
            })
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onShip = async () => {
        try {
            setLoading(true);
            await axios.post(`/api/${params.storeId}/orders/${data.id}`);
            router.refresh();
            toast({
                description: "订单已发货.",
                action: (
                    <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                ),
            })
        } catch (error) {
            toast({
                variant: "destructive",
                description: "发货失败.",
                action: <ToastAction altText="Try again">收回</ToastAction>,
            })
        } finally {
            setLoading(false);
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
                    <DropdownMenuItem onClick={() => onCopy(data.phone)}>
                        <Copy className="mr-2 h-4 w-4" />
                        复制电话
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy(data.address)}>
                        <Copy className="mr-2 h-4 w-4" />
                        复制地址
                    </DropdownMenuItem>
                    {userRole === "seller" && (
                        <DropdownMenuItem disabled={isShipDisabled} onClick={onShip}>
                            <Truck className="mr-2 h-4 w-4" />
                            发货
                        </DropdownMenuItem>
                    )}
                    {userRole === "buyer" && (
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Trash className="mr-2 h-4 w-4" />
                            删除订单
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
