"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type BillboardColumn = {
  id: string
  label: String
  createdAt: String
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "广告名",
  },
  {
    accessorKey: "createdAt",
    header: "数据",
  },
  {
    id: "actions",
    header: "更多",
    cell: ({row}) =><CellAction data={row.original} />
  }
]
