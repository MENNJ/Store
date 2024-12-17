"use client";
import { Check, ChevronsUpDown, Plus, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation";
import { PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/store/use-store-modal";
import { cn } from "@/lib/utils";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type PopverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopverTriggerProps {
    items: Store[];
};
export default function StoreSwitcher({
    items = []
}: StoreSwitcherProps) {
    const storeModal = useStoreModal();

    const params = useParams();

    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    if (!params) {
        return null
    }

    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const [open, setOpen] = useState(false);

    const onStorSelect = (store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/store/${store.value}`);
    }

    return (
        <SidebarHeader className="p-0">
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <StoreIcon className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {currentStore?.label}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side="bottom"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                商店列表
                            </DropdownMenuLabel>
                            {formattedItems.map((store) => (
                                <DropdownMenuItem
                                    key={store.value}
                                    onClick={() => onStorSelect(store)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        <StoreIcon className="size-4 shrink-0" />
                                    </div>
                                    {store.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentStore?.value === store.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 p-2" onSelect={() => {
                                setOpen(false);
                                storeModal.onOPen();
                            }}>
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">
                                    创建商店
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    )
}
