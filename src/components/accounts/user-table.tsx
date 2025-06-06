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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { IconChevronDown, IconDotsVertical, IconLayoutColumns, IconPlus } from "@tabler/icons-react"

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
  onStatusChange: (userId: string, newStatus: User['status']) => void;
  onRoleChange: (userId: string, newRole: User['role']) => void;
  onDepartmentChange: (userId: string, newDepartment: string) => void;
  onRemoveUser: (userId: string) => void;
  onInviteUser: () => void;
  selectedDepartment: string;
  selectedRole: string;
  selectedStatus: string;
  onFilterChange: (columnId: string, value: string) => void;
}

export function UserTable({
  data,
  onStatusChange,
  onRoleChange,
  onDepartmentChange,
  onRemoveUser,
  onInviteUser,
  selectedDepartment,
  selectedRole,
  selectedStatus,
  onFilterChange,
}: UserTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        let colorClass = "";

        switch (role) {
          case "super admin":
            variant = "default";
            colorClass = "bg-purple-500 text-purple-50";
            break;
          case "admin":
            variant = "secondary";
            colorClass = "bg-blue-500 text-blue-50";
            break;
          case "user":
            variant = "outline";
            colorClass = "text-gray-600 border-gray-300";
            break;
          case "viewer":
            variant = "outline";
            colorClass = "text-gray-500 border-gray-300";
            break;
          default:
            variant = "outline";
            break;
        }

        return (
          <Badge variant={variant} className={`capitalize rounded-lg opacity-80 ${colorClass}`}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        let colorClass = "";

        switch (status) {
          case "active":
            variant = "default";
            colorClass = "bg-green-500 text-green-50";
            break;
          case "inactive":
            variant = "secondary";
            colorClass = "bg-red-500 text-red-50";
            break;
          case "pending":
            variant = "outline";
            colorClass = "text-yellow-600 border-yellow-300";
            break;
          default:
            variant = "outline";
            break;
        }

        return (
          <Badge variant={variant} className={`capitalize rounded-lg opacity-80 ${colorClass}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Select defaultValue={row.original.department}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.lastLogin ? new Date(row.original.lastLogin).toLocaleDateString() : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {row.original.status === 'active' ? (
              <DropdownMenuItem onClick={() => onStatusChange(row.original.id, 'inactive')}>Deactivate</DropdownMenuItem>
            ) : (
               <DropdownMenuItem onClick={() => onStatusChange(row.original.id, 'active')}>Activate</DropdownMenuItem>
            )}
            {row.original.role === 'user' && (
               <DropdownMenuItem onClick={() => onRoleChange(row.original.id, 'admin')}>Promote to Admin</DropdownMenuItem>
            )}
             {row.original.role === 'admin' && (
               <DropdownMenuItem onClick={() => onRoleChange(row.original.id, 'super admin')}>Promote to Super Admin</DropdownMenuItem>
            )}
            {row.original.role === 'admin' && (
               <DropdownMenuItem onClick={() => onRoleChange(row.original.id, 'user')}>Demote to User</DropdownMenuItem>
            )}
             {row.original.role === 'super admin' && (
               <DropdownMenuItem onClick={() => onRoleChange(row.original.id, 'admin')}>Demote from Super Admin</DropdownMenuItem>
            )}

             {row.original.role !== 'super admin' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onRemoveUser(row.original.id)}>Remove Account</DropdownMenuItem>
                </>
             )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <IconChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem disabled>Filter by:</DropdownMenuCheckboxItem>
            <DropdownMenuItem><Select value={selectedDepartment} onValueChange={(value) => onFilterChange('department', value)}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="">All Departments</SelectItem>
                   <SelectItem value="sales">Sales</SelectItem>
                   <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select></DropdownMenuItem>
            <DropdownMenuItem><Select value={selectedRole} onValueChange={(value) => onFilterChange('role', value)}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="super admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select></DropdownMenuItem>
             <DropdownMenuItem><Select value={selectedStatus} onValueChange={(value) => onFilterChange('status', value)}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="">All Status</SelectItem>
                   <SelectItem value="active">Active</SelectItem>
                   <SelectItem value="inactive">Inactive</SelectItem>
                   <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select></DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onInviteUser}>
              <IconPlus className="mr-2 h-4 w-4" /> Invite User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 