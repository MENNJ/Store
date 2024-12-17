import Footer from "@/components/footer"
import ModalProvider from "@/providers/store/modal-provider"
interface HomeLayoutProps {
    children: React.ReactNode
}

const HomeLayout = async ({
    children
}: HomeLayoutProps) => {

    return (
        <>
            {children}
            <Footer />
            <ModalProvider />
        </>
    )
}
export default HomeLayout