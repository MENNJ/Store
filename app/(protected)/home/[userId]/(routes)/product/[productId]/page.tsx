import ProductList from '@/components/product-list'
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import getProduct from '@/actions/Store/get-product';
import Container from '@/components/ui/container';
import allProduct from '@/actions/Store/get-allproduct';

export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  },
}

const ProductPage: React.FC<ProductPageProps> = async ({
  params
}) => {
  const product = await getProduct(params.productId);

  const allProducts = await allProduct() ?? [];

  const relatedProducts = allProducts.filter(item => item.id !== params.productId);

  if (!product) {
    return null;
  }

  return (
    <>
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-12 sm:px-0 lg:mt-0">
              <Info data={product} />
            </div>
          </div>
          <hr className="my-10" />
          <ProductList title="相关产品" items={relatedProducts} />
        </div>
      </Container>
    </>
  )
}

export default ProductPage;
