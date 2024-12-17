import allProduct from "@/actions/Store/get-allproduct";
import getBillboard from "@/actions/Store/get-billboard";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
    const products = await allProduct() ?? [];
    const billboards = await getBillboard();

    return (
        <Container>
            <div className="mb-10">
                <Billboard data={billboards} />
                <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                    <ProductList title="全部商品" items={products} />
                </div>
            </div>
        </Container>
    );
};

export default HomePage;
