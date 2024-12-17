import getUser from "@/actions/Store/get-userId";
import getuserProducts from "@/actions/Store/get-userProduct";
import StoreBackground from "@/components/storeBackground";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

export const revalidate = 0;
interface HomePageProps {
  params: {
    userId: string;
  };
}
const HomePage: React.FC<HomePageProps> = async ({ params }) => {
  const { userId } = params;
  const products = await getuserProducts(userId);
  const user = await getUser(userId);

  return (
    <Container>
      <StoreBackground user={user} />
      <div className="space-y-10 ml-2 mt-5 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title={`${user.name}的全部宝贝`} items={products} />
        </div>
      </div>
    </Container>
  )
};

export default HomePage;
