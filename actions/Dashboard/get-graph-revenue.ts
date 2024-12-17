import { db } from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;
    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphData[] = [
    { name: "一月", total: 0 },
    { name: "二月", total: 0 },
    { name: "三月", total: 0 },
    { name: "四月", total: 0 },
    { name: "五月", total: 0 },
    { name: "六月", total: 0 },
    { name: "七月", total: 0 },
    { name: "八月", total: 0 },
    { name: "九月", total: 0 },
    { name: "十月", total: 0 },
    { name: "十一月", total: 0 },
    { name: "十二月", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
