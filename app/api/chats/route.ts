import { auth } from "@/auth";
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId1 = session?.user?.id;

    if (!userId1) {
      return new NextResponse("未经授权的用户", { status: 401 });
    }
    const url = new URL(req.url);
    const conversationId = url.searchParams.get('conversation_id');

    if (!conversationId) {
      return new NextResponse("缺少conversation_id", { status: 400 });
    }

    const messages = await db.message.findMany({
      where: {
        conversation_id: Number(conversationId),
      },
      orderBy: {
        sent_at: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return new NextResponse("内部错误", { status: 500 });
  }
}
