import { auth } from "@/auth";
import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { storeId: string }; 
}) {
    const session = await auth();

    if (!session?.user.id) {
        redirect("/auth/login");
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId: session.user.id,
        }
    });

    if (!store) {
        redirect('/')
    }

    return (
        <>
            {children}
        </>
    )
}