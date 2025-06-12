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
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';
import { useAccounts } from '@/hooks/use-accounts';
import { toast } from '@/components/ui/toast';
import { Skeleton } from "@/components/ui/skeleton";

// Update the User type to match the backend
type User = {
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
};

// Dummy data (adjusting for the new UI)
const dummyUsers: User[] = [
  {
    id: '1',
    user_name: 'chris_chris',
    first_name: 'Chris',
    last_name: 'Chris',
    email: 'bluebird23szn@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Engineering',
    created_at: '2023-09-01T00:00:00Z',
    updated_at: '2023-09-01T00:00:00Z',
  },
  {
    id: '2',
    user_name: 'prince_nedjoh',
    first_name: 'Prince',
    last_name: 'Nedjoh',
    email: 'princenedjoh5@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Sales',
    created_at: '2023-09-05T00:00:00Z',
    updated_at: '2023-09-05T00:00:00Z',
  },
  {
    id: '3',
    user_name: 'chris_blam',
    first_name: 'Chris',
    last_name: 'Blam',
    email: 'campeh9@gmail.com',
    role: 'ADMIN',
    status: 'INACTIVE',
    department: 'Marketing',
    created_at: '2023-09-10T00:00:00Z',
    updated_at: '2023-09-10T00:00:00Z',
  },
  {
    id: '4',
    user_name: 'string_string',
    first_name: 'String',
    last_name: 'String',
    email: 'bluebird@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Support',
    created_at: '2023-10-01T00:00:00Z',
    updated_at: '2023-10-01T00:00:00Z',
  },
  {
    id: '5',
    user_name: 'prince_nedjoh_2',
    first_name: 'Prince',
    last_name: 'Nedjoh',
    email: 'princenedjoh5+5@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'IT',
    created_at: '2023-09-15T00:00:00Z',
    updated_at: '2023-09-15T00:00:00Z',
  },
  {
    id: '6',
    user_name: 'chris_ampeh',
    first_name: 'Chris',
    last_name: 'Ampeh',
    email: 'hello@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
  {
    id: '7',
    user_name: 'prince_nedjoh_3',
    first_name: 'Prince',
    last_name: 'Nedjoh',
    email: 'princenedjoh5+3@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
  {
    id: '8',
    user_name: 'prince_nedjoh_4',
    first_name: 'Prince',
    last_name: 'Nedjoh',
    email: 'princenedjoh5+6@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
  {
    id: '9',
    user_name: 'hello_world',
    first_name: 'Hello',
    last_name: 'World',
    email: 'blvcksapphire@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
  {
    id: '10',
    user_name: 'prince_nedjoh_5',
    first_name: 'Prince',
    last_name: 'Nedjoh',
    email: 'princenedjoh5+4@gmail.com',
    role: 'ADMIN',
    status: 'PENDING',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
  {
    id: '11',
    user_name: 'user_1',
    first_name: 'User',
    last_name: 'One',
    email: 'princenedjoh5+1@gmail.com',
    role: 'ADMIN',
    status: 'PENDING',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
  {
    id: '12',
    user_name: 'user_2',
    first_name: 'User',
    last_name: 'Two',
    email: 'princenedjoh5+2@gmail.com',
    role: 'ADMIN',
    status: 'PENDING',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
  {
    id: '13',
    user_name: 'prince_nedjoh_6',
    first_name: 'Prince',
    last_name: 'Nedjoh',
    email: 'princenedjoh5+7@gmail.com',
    role: 'ADMIN',
    status: 'PENDING',
    department: 'Finance',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z',
  },
];

const AccountManagement = () => {
  const { 
    accounts: users,
    isLoading,
    error,
    refetch,
    updateRole,
    updateStatus,
    updateDepartment,
    deleteAccount,
    isMutating
  } = useAccounts();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const handleRemoveUser = async (userId: string) => {
    try {
      await deleteAccount(userId);
    } catch (error) {
      toast.error({
        title: 'Deletion failed',
        description: 'Failed to delete user account.',
      });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Full Name",
      cell: ({ row }) => (
        <Text
          textColor="rgb(31 41 55)"
          size={TypographySize.body}
          bold={TypographyBold.sm2}
        >
          {`${row.original.first_name} ${row.original.last_name}`}
        </Text>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <Text
          textColor="rgb(31 41 55)"
          size={TypographySize.body}
          className="lowercase"
        >
          {row.getValue("email")}
        </Text>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge className="bg-blue-100 text-blue-800">
          {row.getValue("role")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as User['status'];
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
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Text
          textColor="rgb(31 41 55)"
          size={TypographySize.body}
        >
          {row.getValue("department")}
        </Text>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = row.original.created_at;
        if (!createdAt) return (
          <Text
            textColor="rgb(156 163 175)"
            size={TypographySize.body}
          >
            unknown
          </Text>
        );

        const date = parseISO(createdAt);

        return (
          <Text
            textColor="rgb(156 163 175)"
            size={TypographySize.body}
          >
            {date.toLocaleString('en-US', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            })}
          </Text>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Last Active",
      cell: ({ row }) => {
        const date = parseISO(row.getValue("updated_at"));
        const now = new Date();
        const diffInMinutes = Math.abs(now.getTime() - date.getTime()) / (1000 * 60);

        let timeText = "";
        if (diffInMinutes < 1) {
          timeText = "just now";
        } else if (diffInMinutes < 60) {
          timeText = `${Math.round(diffInMinutes)} minutes ago`;
        } else if (diffInMinutes < 60 * 24) {
          timeText = formatDistanceToNow(date, { addSuffix: true });
        } else {
          timeText = date.toLocaleString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          });
        }

        return (
          <Text
            textColor="rgb(156 163 175)"
            size={TypographySize.body}
          >
            {timeText}
          </Text>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDelete = () => deleteAccount(row.original.id);
        const handleEdit = () => {
          // TODO: Implement edit functionality
          console.log('Edit user:', row.original);
        };

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleDelete}>
              <IconTrash className="h-4 w-4 text-red-500" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleEdit}>
              <IconEdit className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        );
      },
    },
  ];

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
    try {
      await refetch();
      toast.success({
        title: 'Accounts refreshed',
        // description: 'The account list has been successfully updated.',
      })
    } catch (error) {
      toast.error({
        title: 'Refresh failed',
        description: 'Failed to refresh the account list.',
      });
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await updateStatus({ id: userId, status: newStatus });
    } catch (error) {
      toast.error({
        title: 'Status update failed',
        description: 'Failed to update user status.',
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await updateRole({ id: userId, role: newRole });
    } catch (error) {
      toast.error({
        title: 'Role update failed',
        description: 'Failed to update user role.',
      });
    }
  };

  const handleDepartmentChange = async (userId: string, newDepartment: string) => {
    try {
      await updateDepartment({ id: userId, department: newDepartment });
    } catch (error) {
      toast.error({
        title: 'Department update failed',
        description: 'Failed to update user department.',
      });
    }
  };

  const handleInviteUser = () => {
    setShowInviteModal(true);
  };

  const handleDeleteClick = (user: User) => {
    handleRemoveUser(user.id);
  };

  const handleEditClick = (user: User) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', user);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate counts for metric cards
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'ACTIVE').length;
  const inactiveUsers = users.filter(user => user.status === 'INACTIVE').length;
  const pendingUsers = users.filter(user => user.status === 'PENDING').length;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Text
            textColor="rgb(239 68 68)"
            size={TypographySize.body}
            bold={TypographyBold.sm2}
          >
            Error loading accounts
          </Text>
          <Text
            textColor="rgb(156 163 175)"
            size={TypographySize.body}
          >
            {error instanceof Error ? error.message : 'An error occurred while loading accounts'}
          </Text>
          <Button 
            onClick={handleRefresh}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <MetricCards 
          totalUsers={totalUsers} 
          activeUsers={activeUsers} 
          inactiveUsers={inactiveUsers} 
          pendingInvites={pendingUsers} 
        />
      )}

      <UserTableControls 
        table={table}
        onRefresh={handleRefresh}
        isRefreshing={isLoading || isMutating}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        currentStatusFilter={statusFilter}
        currentRoleFilter={roleFilter}
      />

      {isLoading ? (
        <div className="rounded-md border w-full">
          <div className="h-12 border-b bg-white px-4 flex items-center justify-between">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-[calc(100%/7 - 1rem)] mx-2" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b bg-white px-4 flex items-center justify-between">
              {Array.from({ length: 7 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-[calc(100%/7 - 1rem)] mx-2" />
              ))}
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default AccountManagement; 