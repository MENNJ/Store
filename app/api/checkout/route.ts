import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";

export async function POST(
  req: Request,
) {
  const body = await req.json();

  const { productId, userId, address, phone } = body;

  if (!productId) {
    return new NextResponse("productId not found", { status: 403 });
  }
  if (!userId) {
    return new NextResponse("userId not found", { status: 403 });
  }
  if (!address) {
    return new NextResponse("address not found", { status: 403 });
  }
  if (!phone) {
    return new NextResponse("phone not found", { status: 403 });
  }

  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return new NextResponse("Store not found", { status: 404 });
  }

  const order = await db.order.create({
    data: {
      storeId: product.storeId,
      BuyersId: userId,
      SellerId: product.userId,
      phone,
      Price: product.price,
      address: address.join(", "),
      isPaid: true,
      orderItems: {
        create: [
          {
            productId,
          },
        ],
      },
    },
  });

  return new NextResponse(JSON.stringify(order), { status: 201 });
}
