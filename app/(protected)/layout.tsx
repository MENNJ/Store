import { auth } from "@/auth";
import StoreSwitcher from "@/components/store-switcher"
import { DropdownMenu, } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"
import { db } from "@/lib/prismadb";
import UserButton from "@/components/user-button";
import { BreadcrumbPages } from "@/components/BreadcrumbPage";
import Navbar from "@/components/navbar"


interface ProtectedLayoutProps {
    children: React.ReactNode
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
    const session = await auth();
    const stores = await db.store.findMany({
        where: {
            userId: session?.user?.id,
        },
    });
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <StoreSwitcher items={stores} />
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <Navbar storeId={stores[0].id} />
                <UserButton user={session?.user} />
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <BreadcrumbPages storeId={stores[0].id} />
                <div className="flex flex-1 h-full w-screen md:w-full flex-col ">
                    <div className="h-[calc(100%-4rem)] m-6 mt-0 flex-1 rounded-2xl bg-sidebar md:min-h-min" >
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
export default ProtectedLayout