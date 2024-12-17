"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { useCurrentUser } from "@/hooks/auth/use-current-user"

export type OrderColumn = {
  id: string
  counterpartId: string
  phone: string
  address: string
  isPaid: boolean
  isShip: boolean
  totalPrice: string
  products: string
  createdAt: string
  status: string | JSX.Element
  BuyersId: string
  SellerId: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "产品",
  },
  {
    accessorKey: "phone",
    header: "电话",
  },
  {
    accessorKey: "address",
    header: "地址",
  },
  {
    accessorKey: "totalPrice",
    header: "总价格",
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
  },
  {
    accessorKey: "status",
    header: "状态",
  },
  {
    accessorKey: "counterpartId",
    header: "对方ID",
  },
  {
    id: "actions",
    header: "更多",
    cell: ({ row }) => {
      const data = row.original;
      const user = useCurrentUser();
      const userRole = data.BuyersId === user?.id ? "buyer" : "seller";
      const isShipDisabled = data.isShip;
      return <CellAction data={data} isShipDisabled={isShipDisabled}  userRole={userRole} />;
    },
  }
];
