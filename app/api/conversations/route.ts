import { auth } from "@/auth";
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const session = await auth();

        const userId1 = session?.user?.id;

        if (!userId1) {
            return new NextResponse("未经授权的用户", { status: 401 });
        }

        const body = await req.json();

        const { userId } = body;

        if (!userId) {
            return new NextResponse("缺少卖家用户id", { status: 400 });
        }

        if (userId1 === userId) {
            return new NextResponse("无法与自己对话", { status: 400 });
        }

        const existingConversation = await db.conversation.findFirst({
            where: {
                OR: [
                    { user1_id: userId1, user2_id: userId },
                    { user1_id: userId, user2_id: userId1 },
                ],
            },
        });

        if (existingConversation) {
            return NextResponse.json(existingConversation, { status: 201 });
        }

        const conversation = await db.conversation.create({
            data: {
                user1_id: userId1,
                user2_id: userId,
            },
        });

        return NextResponse.json(conversation, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse("内部错误", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        const userId1 = session?.user?.id;

        if (!userId1) {
            return new NextResponse("未经授权的用户", { status: 401 });
        }

        const conversations = await db.conversation.findMany({
            where: {
                OR: [{ user1_id: userId1 }, { user2_id: userId1 }],
            },
            include: {
                user1: { select: { id: true, username: true, image: true, name: true, email: true } },
                user2: { select: { id: true, username: true, image: true, name: true, email: true } },
                messages: {
                    orderBy: { sent_at: "asc" },
                    select: {
                        message_id: true,
                        conversation_id: true,
                        type: true,
                        sender_id: true,
                        message: true,
                        sent_at: true,
                        sender: { select: { id: true, username: true, image: true, name: true, email: true } },
                    },
                },
            },
        });

        const sortedConversations = conversations.sort((a, b) => {
            const lastMessageA = a.messages?.length ? a.messages[a.messages.length - 1]?.sent_at ?? new Date(0) : new Date(0);
            const lastMessageB = b.messages?.length ? b.messages[b.messages.length - 1]?.sent_at ?? new Date(0) : new Date(0);
            return lastMessageB.getTime() - lastMessageA.getTime();
        });

        return NextResponse.json(sortedConversations);
    } catch (error) {
        console.error(error);
        return new NextResponse("内部错误", { status: 500 });
    }
}
