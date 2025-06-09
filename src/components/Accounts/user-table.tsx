"use client"

import * as React from "react"
import { z } from "zod"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconChevronDown, IconDotsVertical, IconLayoutColumns, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { formatDistanceToNow, parseISO } from 'date-fns';

// Schema for user data
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["super admin", "admin", "user", "viewer"]),
  status: z.enum(["active", "inactive", "pending"]),
  department: z.string(),
  lastLogin: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
})

export type User = z.infer<typeof userSchema>

interface UserTableProps {
  data: User[];
  columns: ColumnDef<User>[];
  onStatusChange: (userId: string, newStatus: User['status']) => void;
  onRoleChange: (userId: string, newRole: User['role']) => void;
  onDepartmentChange: (userId: string, newDepartment: string) => void;
  onRemoveUser: (userId: string) => void;
  onInviteUser: () => void;
}

export function UserTable({
  data,
  columns,
  onStatusChange,
  onRoleChange,
  onDepartmentChange,
  onRemoveUser,
  onInviteUser,
}: UserTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full h-full flex flex-col">
      <div className="rounded-md flex-1 flex flex-col overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0 border-gray-200">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="flex-1 overflow-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 border-r last:border-r-0 border-gray-200">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 