import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;

        if (!orderId) {
            return new NextResponse("Order ID is missing", { status: 400 });
        }

        const order = await db.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true },
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        await db.orderItem.deleteMany({
            where: {
                orderId: orderId,
            },
        });

        await db.order.delete({
            where: { id: orderId },
        });

        return new NextResponse("Order deleted successfully", { status: 200 });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


export async function POST(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;

        if (!orderId) {
            return new NextResponse("Order ID is missing", { status: 400 });
        }

        const order = await db.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true },
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        await db.order.update({
            where: { id: orderId },
            data: {
                isShip: true,
            },
        });

        return new NextResponse("Order marked as shipped", { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


