"use client";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
    ShoppingBag,
    Mail,
    UserCog,
    Shield,
    Smartphone,
    HardDrive,
    Cog,
    Package,
    Clapperboard,
    ChartNoAxesCombined,
    MessageCircleMore,
    Bot,
    ChevronRight,
    Store,
    SquareTerminal,
} from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { initSocket, socket } from "@/socket";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface NavbarProps {
    storeId: string;
}

const Navbar: React.FC<NavbarProps> = ({
    storeId
}) => {
    const router = useRouter();
    const user = useCurrentUser();
    const { toast } = useToast();
    const pathname = usePathname();
    if (!pathname) return null;

    const data = {
        navMain: [
            {
                title: "商店",
                url: "#",
                icon: Store,
                isActive: pathname.startsWith(`/home`),
                items: [
                    {
                        url: `/home`,
                        title: "商店首页",
                        icon: ShoppingBag,
                    }
                ],
            },
            {
                title: "商店管理系统",
                url: "",
                icon: SquareTerminal,
                isActive: pathname.startsWith(`/store/${storeId}`),
                items: [
                    {
                        title: "概述",
                        url: `/store/${storeId}`,
                        icon: ChartNoAxesCombined,
                    },
                    {
                        title: "广告",
                        url: `/store/${storeId}/billboards`,
                        icon: Clapperboard,
                    },

                    {
                        title: "产品",
                        url: `/store/${storeId}/products`,
                        icon: Store,
                    },
                    {
                        title: "订单",
                        url: `/store/${storeId}/orders`,
                        icon: Package,
                    },
                    {
                        title: "设置",
                        url: `/store/${storeId}/settings`,
                        icon: Cog,
                    },
                ],
            },
            {
                title: "消息",
                url: "#",
                icon: Mail,
                isActive: pathname.startsWith(`/home/${storeId}/conversations`),
                items: [
                    {
                        title: "个人消息",
                        url: `/home/${storeId}/conversations`,
                        icon: MessageCircleMore,
                    },
                ],
            },
            {
                title: "用户管理系统",
                url: "",
                icon: Bot,
                isActive:
                    pathname === `/user/${storeId}/server` ||
                    pathname === `/user/${storeId}/client` ||
                    pathname === `/user/${storeId}/admin` ||
                    pathname === `/user/${storeId}/settings`,
                items: [
                    {
                        title: "服务器",
                        url: `/user/${storeId}/server`,
                        icon: HardDrive,
                    },
                    {
                        title: "终端",
                        url: `/user/${storeId}/client`,
                        icon: Smartphone,
                    },
                    {
                        title: "管理员",
                        url: `/user/${storeId}/admin`,
                        icon: Shield,
                    },
                    {
                        title: "设置",
                        url: `/user/${storeId}/settings`,
                        icon: UserCog,
                    },
                ],
            },
        ],
    };

    React.useEffect(() => {
        if (user) {
            initSocket(user);
            socket.on("chat", (payload) => {
                if (!window.location.pathname.includes("/conversations")) {
                    toast({
                        description: (
                            <div>
                                <span
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    {payload.fromUser.name}
                                </span>
                                <span>:</span>
                                <span>{payload.comment}</span>
                            </div>
                        ),
                        action: (
                            <ToastAction onClick={() => {
                                router.push(`/home/${storeId}/conversations?conversation_id=${payload.conversation_id}`);
                            }} altText="Goto chat">
                                立即查看
                            </ToastAction>
                        ),
                    });
                }
            });
        }
        return () => {
            if (socket) {
                socket.off("chat");
            }
        };
    }, []);

    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>目录</SidebarGroupLabel>
                <SidebarMenu>
                    {data.navMain.map((item) => (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <span className="text-base font-medium tracking-wider">
                                            {item.title}
                                        </span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items && Array.isArray(item.items) ? (
                                            item.items.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a href={subItem.url}>
                                                            {subItem.icon && <subItem.icon className="mr-2" />}
                                                            <span className="font-medium tracking-wider">
                                                                {subItem.title}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))
                                        ) : null}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
    );
};

export default Navbar;
