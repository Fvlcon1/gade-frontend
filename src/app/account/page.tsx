'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import AccountHeader from "@components/Accounts/AccountHeader";
import MetricCards from "@components/Accounts/MetricCards";
import UserTableSection from "@components/Accounts/UserTableSection";
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/react-table';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { UserTableControls } from "@components/Accounts/UserTableControls";

 const userSchema = z.object({
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

// Dummy data (adjusting for the new UI)
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'chris chris',
    email: 'bluebird23szn@gmail.com',
    role: 'super admin',
    department: 'Engineering',
    status: 'active',
    lastLogin: '2025-06-08T11:28:00Z',
    createdAt: '2023-09-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Prince Nedjoh',
    email: 'princenedjoh5@gmail.com',
    role: 'admin',
    department: 'Sales',
    status: 'active',
    lastLogin: '2025-06-08T10:47:00Z',
    createdAt: '2023-09-05T00:00:00Z',
  },
  {
    id: '3',
    name: 'Chris Blam',
    email: 'campeh9@gmail.com',
    role: 'admin',
    department: 'Marketing',
    status: 'inactive',
    lastLogin: null,
    createdAt: '2023-09-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'string string',
    email: 'bluebird@gmail.com',
    role: 'super admin',
    status: 'active',
    department: 'Support',
    lastLogin: null,
    createdAt: '2023-10-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Prince Nedjoh',
    email: 'princenedjoh5+5@gmail.com',
    role: 'admin',
    status: 'active',
    department: 'IT',
    lastLogin: '2025-06-08T10:47:00Z',
    createdAt: '2023-09-15T00:00:00Z',
  },
  {
    id: '6',
    name: 'chris ampeh',
    email: 'hello@gmail.com',
    role: 'admin',
    status: 'active',
    department: 'Finance',
    lastLogin: '2025-06-07T05:00:00Z',
    createdAt: '2023-09-20T00:00:00Z',
  },
  {
    id: '7',
    name: 'Prince Nedjoh',
    email: 'princenedjoh5+3@gmail.com',
    role: 'admin',
    status: 'active',
    department: 'Finance',
    lastLogin: '2025-06-07T10:22:00Z',
    createdAt: '2023-09-20T00:00:00Z',
  },
  {
    id: '8',
    name: 'Prince Nedjoh',
    email: 'princenedjoh5+6@gmail.com',
    role: 'admin',
    status: 'active',
    department: 'Finance',
    lastLogin: '2025-06-08T10:47:00Z',
    createdAt: '2023-09-20T00:00:00Z',
  },
  {
    id: '9',
    name: 'hello world',
    email: 'blvcksapphire@gmail.com',
    role: 'super admin',
    status: 'active',
    department: 'Finance',
    lastLogin: '2025-06-08T10:47:00Z',
    createdAt: '2023-09-20T00:00:00Z',
  },
  {
    id: '10',
    name: 'Prince Nedjoh',
    email: 'princenedjoh5+4@gmail.com',
    role: 'admin',
    status: 'pending',
    department: 'Finance',
    lastLogin: null,
    createdAt: '2023-09-20T00:00:00Z',
  },
  {
    id: '11',
    name: '-',
    email: 'princenedjoh5+1@gmail.com',
    role: 'admin',
    status: 'pending',
    department: 'Finance',
    lastLogin: null,
    createdAt: '2023-09-20T00:00:00Z',
  },
  {
    id: '12',
    name: '-',
    email: 'princenedjoh5+2@gmail.com',
    role: 'admin',
    status: 'pending',
    department: 'Finance',
    lastLogin: null,
    createdAt: '2023-09-20T00:00:00Z',
  },
  {
    id: '13',
    name: 'Prince Nedjoh',
    email: 'princenedjoh5+7@gmail.com',
    role: 'admin',
    status: 'pending',
    department: 'Finance',
    lastLogin: '2025-06-07T11:09:00Z',
    createdAt: '2023-09-20T00:00:00Z',
  },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Fullname",
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
          colorClass = "bg-[#E6E6FA] text-[#800080]"; // Light purple
          break;
        case "admin":
          variant = "secondary";
          colorClass = "bg-[#CCE0FF] text-[#0066CC]"; // Light blue
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
          colorClass = "bg-[#E0F8E0] text-[#008000]"; // Light green
          break;
        case "inactive":
          variant = "secondary";
          colorClass = "bg-[#FCE0E0] text-[#CC0000]"; // Light red
          break;
        case "pending":
          variant = "outline";
          colorClass = "bg-[#FFF8E0] text-[#B38600]"; // Light yellow/orange
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
    accessorKey: "lastLogin",
    header: "Last Active",
    cell: ({ row }) => {
      const lastLogin = row.original.lastLogin;
      if (!lastLogin) return <div className="text-muted-foreground">unknown</div>;

      const date = parseISO(lastLogin);
      const now = new Date();
      const diffInMinutes = Math.abs(now.getTime() - date.getTime()) / (1000 * 60);

      if (diffInMinutes < 1) {
        return <div className="text-muted-foreground">just now</div>;
      } else if (diffInMinutes < 60) {
        return <div className="text-muted-foreground">{Math.round(diffInMinutes)} minutes ago</div>;
      } else if (diffInMinutes < 60 * 24) { // Less than 24 hours
        return <div className="text-muted-foreground">{formatDistanceToNow(date, { addSuffix: true })}</div>;
      } else {
        return <div className="text-muted-foreground">{new Date(lastLogin).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</div>;
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <IconTrash className="h-4 w-4 text-red-500" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <IconEdit className="h-4 w-4 text-blue-500" />
        </Button>
      </div>
    ),
  },
];

const AccountManagement = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate fetching new data
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    // In a real application, you would re-fetch your user data here
    // For now, we'll just cycle the dummy data to show refresh effect
    setUsers([...dummyUsers.sort(() => Math.random() - 0.5)]); 
    setIsRefreshing(false);
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDepartmentChange = (userId: string, newDepartment: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, department: newDepartment } : user
    ));
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleInviteUser = () => {
    setShowInviteModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter.toLowerCase();
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate counts for new MetricDisplayCard components
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  const pendingInvites = users.filter(user => user.status === 'pending').length;

  return (
    <div 
      className="flex flex-col flex-1 p-6 bg-gray-50 overflow-y-auto" 
      style={{ 
        height: "calc(100vh - 64px)",
        scrollbarWidth: "thin",
        scrollbarColor: "#d1d5db #f3f4f6"
      }}
    >
      <AccountHeader onInviteUser={handleInviteUser} />

      <MetricCards 
        totalUsers={totalUsers} 
        activeUsers={activeUsers} 
        inactiveUsers={inactiveUsers} 
        pendingInvites={pendingInvites} 
      />

      {/* User Table Controls (Search and Pagination) */}
      <UserTableControls 
        table={table}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        currentStatusFilter={statusFilter}
        currentRoleFilter={roleFilter}
      />

      <UserTableSection 
        filteredUsers={filteredUsers}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        onDepartmentChange={handleDepartmentChange}
        onRemoveUser={handleRemoveUser}
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
        onInviteUser={handleInviteUser}
      />
    </div>
  );
};

export default AccountManagement; 