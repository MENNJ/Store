"use client";

import { ChevronDown, Slash } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";

export function BreadcrumbPages({ storeId }: { storeId: string }) {
    const pathname = usePathname();

    let controlTitle = "";
    let controlUrl = "";
    let subMenuItems: { title: string; url: string }[] = [];

    if (pathname.startsWith("/store")) {
        controlTitle = "概述";
        controlUrl = `/store/${storeId}`;
        subMenuItems = [
            { title: "广告", url: `/store/${storeId}/billboards` },
            { title: "产品", url: `/store/${storeId}/products` },
            { title: "订单", url: `/store/${storeId}/orders` },
            { title: "设置", url: `/store/${storeId}/settings` },
        ];
    }
    
    if (pathname.startsWith("/user")) {
        controlTitle = "用户管理系统";
        controlUrl = `/user/${storeId}/settings`;
        subMenuItems = [
            { title: "服务器", url: `/user/${storeId}/server` },
            { title: "终端", url: `/user/${storeId}/client` },
            { title: "管理员", url: `/user/${storeId}/admin` },
            { title: "设置", url: `/user/${storeId}/settings` },
        ];
    }

    if (pathname.startsWith("/home")) {
        controlTitle = "商店";
        controlUrl = "/home";
        subMenuItems = [
            { title: "商店", url: `/home` },
            { title: "消息", url: `/home/${storeId}/conversations` },
        ];
    }

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={controlUrl}>{controlTitle}</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator>
                            <Slash />
                        </BreadcrumbSeparator>

                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    子菜单
                                    <ChevronDown className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {subMenuItems.map((item, index) => (
                                        <DropdownMenuItem key={index}>
                                            <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
