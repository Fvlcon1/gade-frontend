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
  user_name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
  department: z.string(),
  last_active: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type User = {
  id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'ADMIN' | 'STANDARD';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  department: string;
  created_at: string;
  updated_at: string;
  last_active?: string;
};

interface UserTableProps {
  data: User[];
  columns: ColumnDef<User>[];
  onStatusChange: (userId: string, newStatus: User['status']) => void;
  onRoleChange: (userId: string, newRole: User['role']) => void;
  onDepartmentChange: (userId: string, newDepartment: string) => void;
  onRemoveUser: (userId: string) => void;
  onInviteUser: () => void;
}

const getStatusBadge = (status: User['status']) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case 'INACTIVE':
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
    case 'PENDING':
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    default:
      return null;
  }
};

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