'use client';
import React, { useState } from 'react';
import { 
  Users, Mail, 
  Building2, CheckCircle2, 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconTrendingUp, IconPlus, IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";
import { UserTable, User } from "@/components/accounts/user-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

// Dummy data
const analytics = [
  { label: 'Total Users', value: '156', icon: Users, color: 'bg-blue-500' },
  { label: 'Active Users', value: '142', icon: CheckCircle2, color: 'bg-green-500' },
  { label: 'Pending Invites', value: '8', icon: Mail, color: 'bg-yellow-500' },
  { label: 'Departments', value: '6', icon: Building2, color: 'bg-purple-500' },
];

const departments = ['Mining', 'Forestry', 'Water Resources', 'Administration', 'IT', 'Finance'];
const roles = ['super admin', 'admin', 'user', 'viewer'];
const statuses = ['active', 'inactive', 'pending'];

const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@gade.gov.gh',
    role: 'super admin',
    department: 'Engineering',
    status: 'active',
    lastLogin: '2023-10-26T10:00:00Z',
    createdAt: '2023-09-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@gade.gov.gh',
    role: 'admin',
    department: 'Sales',
    status: 'active',
    lastLogin: '2023-10-25T14:30:00Z',
    createdAt: '2023-09-05T00:00:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@gade.gov.gh',
    role: 'user',
    department: 'Marketing',
    status: 'inactive',
    lastLogin: '2023-10-20T09:00:00Z',
    createdAt: '2023-09-10T00:00:00Z',
  },
   {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'user',
    status: 'pending',
    department: 'Support',
    lastLogin: null,
    createdAt: '2023-10-01T00:00:00Z',
  },
];

// Define a basic card component for metrics
function MetricCard({
  title,
  value,
  change,
  description,
}: {
  title: string;
  value: string;
  change: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* Icon can go here */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {change}
          {change.includes('up') ? <IconTrendingUp className="ml-1 h-4 w-4 text-green-500" /> : <IconTrendingUp className="ml-1 h-4 w-4 text-red-500 transform rotate-180" />}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

const AccountManagement = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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

  const handleFilterChange = (columnId: string, value: string) => {
    switch (columnId) {
      case 'department':
        setSelectedDepartment(value);
        break;
      case 'role':
        setSelectedRole(value as User['role']);
        break;
      case 'status':
        setSelectedStatus(value as User['status']);
        break;
      default:
        break;
    }
  };

  const handleInviteUser = () => {
    setShowInviteModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || user.department === selectedDepartment;
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // Dummy data for cards
  const cardData = [
    {
      title: "Total Accounts",
      value: "1,234",
      change: "+10% ",
      description: "since last month",
    },
    {
      title: "Active Accounts",
      value: dummyUsers.filter(user => user.status === 'active').length.toString(),
      change: "+5% ",
      description: "since last month",
    },
    {
      title: "Pending Invites",
      value: dummyUsers.filter(user => user.status === 'pending').length.toString(),
      change: "-2% ",
      description: "since last month",
    },
    {
      title: "New Signups",
      value: "120",
      change: "+15% ",
      description: "since last month",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Account Management</h1>
      </div>

      {/* Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>

      {/* Actions Bar with Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px] max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-4 flex-1 min-w-[250px]">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[150px]"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[150px]"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[150px]"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Action Buttons Row */}
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns className="mr-2 h-4 w-4" />
                  Columns
                  <IconChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" />
            </DropdownMenu>
            <Button size="sm" onClick={handleInviteUser}>
              <IconPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs and Table Section */}
      <Tabs defaultValue="overview">
        <TabsList>{/* Tabs will go here later if needed */}</TabsList>
        <TabsContent value="overview" className="space-y-4">
          <UserTable 
            data={filteredUsers}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
            onDepartmentChange={handleDepartmentChange}
            onRemoveUser={handleRemoveUser}
            onInviteUser={handleInviteUser}
            selectedDepartment={selectedDepartment}
            selectedRole={selectedRole}
            selectedStatus={selectedStatus}
            onFilterChange={handleFilterChange}
          />
        </TabsContent>
      </Tabs>

      {/* Invite Modal - To be implemented */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Invite New User</h2>
            {/* Add invite form here */}
             <Input placeholder="Email address" className="mb-4"/>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowInviteModal(false)}>
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement; 