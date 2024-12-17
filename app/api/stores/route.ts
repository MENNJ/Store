import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prismadb";

export async function POST(
  req: Request,
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("未经授权的", { status: 403 });
    }

    if (!name) {
      return new NextResponse("姓名是必需的", { status: 400 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("内部错误", { status: 500 });
  }
};
