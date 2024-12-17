
"use client"

import * as React from "react"
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,

} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
interface userIdProps {
    user: any
}
export default function UserButton({
    user
}: userIdProps) {
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }
    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        className="object-cover"
                                        src={user?.image || ''}
                                        alt=""
                                    />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user?.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side="bottom"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            src={user?.image || ''}
                                            alt=""
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            CN
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {user?.name}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Sparkles />
                                    升级到专业版
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheck />
                                    账户
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard />
                                    计费
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button className="w-full" size="icon" onClick={toggleTheme}>
                                        <Sun
                                            className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                                                }`}
                                        />
                                        <Moon
                                            className={`absolute h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                                                }`}
                                        />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <Button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex w-full items-center"
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> 登出
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}
