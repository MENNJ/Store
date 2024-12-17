import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("未经身份验证的", { status: 403 });
    }

    if (!name) {
      return new NextResponse("姓名是必需的", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("需要存储id", { status: 400 });
    }

    const store = await db.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("内部错误", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;


    if (!userId) {
      return new NextResponse("未经身份验证的", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("需要存储id", { status: 400 });
    }

    const store = await db.store.deleteMany({
      where: {
        id: params.storeId,
        userId
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("内部错误", { status: 500 });
  }
};
