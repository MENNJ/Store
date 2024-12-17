"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  price: string
  detailed: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "名称",
  },
  {
    accessorKey: "isArchived",
    header: "存档",
  },
  {
    accessorKey: "isFeatured",
    header: "特色",
  },
  {
    accessorKey: "price",
    header: "价格",
  },
  {
    accessorKey: "detailed",
    header: "商品详细信息",
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
  },
  {
    id: "actions",
    header: "更多",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
