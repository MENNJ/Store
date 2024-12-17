import { redirect } from "next/navigation";
import { db } from "@/lib/prismadb";
import { SettingsForm } from "./components/settings-form";
import { auth } from "@/auth";


interface SettingsPageProps {
    params: {
        storeId: string
    }
};


const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const session = await auth();

    if (!session?.user.id) {
        redirect('/sign-in')
    }
    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId: session.user.id
        }
    });
    if (!store) {
        redirect('/')
    }
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6" >
                <SettingsForm initialData={store} />
            </div>
        </div>
    );
}

export default SettingsPage;