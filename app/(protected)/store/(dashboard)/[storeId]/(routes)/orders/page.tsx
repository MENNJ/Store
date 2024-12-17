import { format } from "date-fns";
import { db } from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { auth } from "@/auth";

const OrdersPage = async () => {
    const session = await auth();

    const orders = await db.order.findMany({
        where: {
            OR: [
                { BuyersId: session?.user?.id },
                { SellerId: session?.user?.id }
            ]
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const formattedOrders: OrderColumn[] = orders.map((item) => {
        let status = '';

        if (item.BuyersId === session?.user?.id) {
            status = item.isPaid ? '已支付' : '未支付';
        } 
        
        else if (item.SellerId === session?.user?.id) {
            if (item.isShip) {
                status = '已发货'; 
            } else {
                status = item.isPaid ? '待发货' : '待支付'; 
            }
        } 
        else {
            status = '未知状态';
        }

        return {
            id: item.id,
            phone: item.phone,
            address: item.address,
            products: item.orderItems.map((orderItem) => orderItem.product.name).join(','),
            totalPrice: formatter.format(
                item.orderItems.reduce((total, orderItem) => total + Number(orderItem.product.price), 0)
            ),
            isPaid: item.isPaid,
            isShip: item.isShip,
            createdAt: format(item.createdAt, "M月d日"),
            status: status,
            counterpartId: item.BuyersId === session?.user?.id ? item.SellerId : item.BuyersId,
            BuyersId: item.BuyersId,
            SellerId: item.SellerId,
        };
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;
