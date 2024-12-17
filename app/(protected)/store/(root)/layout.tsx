import { db } from "@/lib/prismadb";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SetupLayout({
    children
}: {
    children: React.ReactNode
}) {

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const store = await db.store.findFirst({
        where: {
            userId: session.user.id
        }
    });

    if (store) {
        redirect(`/store/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    );
};
