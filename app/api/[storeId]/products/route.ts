import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prismadb";


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();
    const { name, price, detailed, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    console.log("133");
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!detailed) {
      return new NextResponse("Detailed id is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    const product = await db.product.create({
      data: {
        name,
        userId,
        price,
        isFeatured,
        isArchived,
        detailed,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
};

// 导出一个异步函数GET，接收两个参数：req和{ params }
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    // 获取请求的URL参数
    const { searchParams } = new URL(req.url)
    // 获取URL参数中的isFeatured值
    const isFeatured = searchParams.get('isFeatured');

    // 如果storeId参数不存在，返回400状态码和错误信息
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // 从数据库中查询产品信息，包括storeId、isFeatured和isArchived字段，并按照createdAt字段降序排列
    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,

      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // 返回查询结果
    return NextResponse.json(products);
  } catch (error) {
    // 如果发生错误，返回500状态码和错误信息
    return new NextResponse("Internal error", { status: 500 });
  }
};
