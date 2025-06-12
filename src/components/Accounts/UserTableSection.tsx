import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/input/input";
import { UserTable, User } from "@components/Accounts/user-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { parseISO, formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';
import { useAccounts } from '@/hooks/use-accounts';
import { toast } from '@/components/ui/toast';

interface UserTableSectionProps {
  filteredUsers: User[];
  onStatusChange: (userId: string, newStatus: User['status']) => void;
  onRoleChange: (userId: string, newRole: User['role']) => void;
  onDepartmentChange: (userId: string, newDepartment: string) => void;
  onRemoveUser: (userId: string) => void;
  showInviteModal: boolean;
  setShowInviteModal: (show: boolean) => void;
  onInviteUser: () => void;
  onDeleteClick: (user: User) => void;
}

const UserTableSection: React.FC<UserTableSectionProps> = ({
  filteredUsers,
  onStatusChange,
  onRoleChange,
  onDepartmentChange,
  onRemoveUser,
  showInviteModal,
  setShowInviteModal,
  onInviteUser,
  onDeleteClick,
}) => {
  const { registerAccount, updateRole, updateStatus, updateDepartment, isMutating } = useAccounts();

  // Define the schema for invite user form validation
  const inviteUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "USER"], { message: "Please select a role" }),
    department: z.string().min(1, "Department is required"),
  });

  type InviteUserFormData = z.infer<typeof inviteUserSchema>;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
  });

  // Define the schema for edit user form validation
  const editUserSchema = z.object({
    role: z.enum(["ADMIN", "USER"], { message: "Please select a role" }),
    department: z.string().min(1, "Department is required"),
    status: z.enum(["ACTIVE", "INACTIVE", "PENDING"], { message: "Please select a status" }),
  });

  type EditUserFormData = z.infer<typeof editUserSchema>;

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit, setValue: setEditValue } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

  const handleSendInvite = async (data: InviteUserFormData) => {
    try {
      await registerAccount({
        email: data.email,
        role: data.role,
        department: data.department
      });

      toast.success({
        title: 'Invitation sent',
        description: 'The user has been successfully invited.',
      });

      reset();
      setShowInviteModal(false);
    } catch (error) {
      toast.error({
        title: 'Invitation failed',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
      });
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
    // Set form values when opening the edit modal
    setEditValue('role', user.role === 'STANDARD' ? 'USER' : user.role);
    setEditValue('department', user.department);
    setEditValue('status', user.status);
  };

  const handleSaveEdit = async (data: EditUserFormData) => {
    if (editingUser) {
      try {
        // Update all fields in parallel
        await Promise.all([
          updateRole({ id: editingUser.id, role: data.role === 'USER' ? 'STANDARD' : data.role }),
          updateDepartment({ id: editingUser.id, department: data.department }),
          updateStatus({ id: editingUser.id, status: data.status }),
        ]);

        toast.success({
          title: 'User updated',
          description: 'The user has been successfully updated.',
        });

        setShowEditModal(false);
        setEditingUser(null);
        resetEdit();
      } catch (error) {
        toast.error({
          title: 'Update failed',
          description: error instanceof Error ? error.message : 'Failed to update user',
        });
      }
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      // Here you would typically call an API to delete the user
      console.log('Deleting user:', deletingUser.id);
      onRemoveUser(deletingUser.id);
    }
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "first_name",
      header: "Full Name",
      cell: ({ row }) => (
        <Text
          textColor="rgb(31 41 55)"
          size={TypographySize.body}
          bold={TypographyBold.sm2}
        >
          {row.original.first_name && row.original.last_name 
            ? `${row.original.first_name} ${row.original.last_name}`
            : 'Not Set'}
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
      cell: ({ row }) => {
        const role = row.original.role;
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        let colorClass = "";

        switch (role) {
          case "ADMIN":
            variant = "default";
            colorClass = "bg-[#E6E6FA] text-[#800080]";
            break;
          case "STANDARD":
            variant = "secondary";
            colorClass = "bg-[#CCE0FF] text-[#0066CC]";
            break;
          default:
            variant = "outline";
            break;
        }

        return (
          <Badge variant={variant} className={`capitalize rounded-lg opacity-80 ${colorClass}`}>
            <Text
              textColor="inherit"
              size={TypographySize.body}
              bold={TypographyBold.sm2}
            >
              {role.toLowerCase()}
            </Text>
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
          case "ACTIVE":
            variant = "default";
            colorClass = "bg-[#E0F8E0] text-[#008000]";
            break;
          case "INACTIVE":
            variant = "secondary";
            colorClass = "bg-[#FCE0E0] text-[#CC0000]";
            break;
          case "PENDING":
            variant = "outline";
            colorClass = "bg-[#FFF8E0] text-[#B38600]";
            break;
          default:
            variant = "outline";
            break;
        }

        return (
          <Badge variant={variant} className={`capitalize rounded-lg opacity-80 ${colorClass}`}>
            <Text
              textColor="inherit"
              size={TypographySize.body}
              bold={TypographyBold.sm2}
            >
              {status.toLowerCase()}
            </Text>
          </Badge>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Text
          textColor="rgb(31 41 55)"
          size={TypographySize.body}
          className="capitalize"
        >
          {row.getValue("department")}
        </Text>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Last Active",
      cell: ({ row }) => {
        const updatedAt = row.original.updated_at;
        if (!updatedAt) return (
          <Text
            textColor="rgb(156 163 175)"
            size={TypographySize.body}
          >
            unknown
          </Text>
        );

        const date = parseISO(updatedAt);
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
          timeText = new Date(updatedAt).toLocaleString('en-US', { 
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDeleteClick(row.original)}>
            <IconTrash className="h-4 w-4 text-red-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditClick(row.original)}>
            <IconEdit className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 min-h-[calc(100vh-24rem)]">
      <Tabs defaultValue="overview" className="h-full flex flex-col">
        <TabsContent value="overview" className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <UserTable 
            data={filteredUsers}
            columns={columns}
            onStatusChange={onStatusChange}
            onRoleChange={onRoleChange}
            onDepartmentChange={onDepartmentChange}
            onRemoveUser={onRemoveUser}
            onInviteUser={onInviteUser}
          />
        </TabsContent>
        <TabsContent value="logs" className="flex-1 p-4 overflow-y-auto">
          <div className="text-gray-500">Activity logs will be displayed here.</div>
        </TabsContent>
      </Tabs>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 border border-gray-100 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-900">
            <h2 className="text-xl font-bold mb-4">Invite New User</h2>
            <form onSubmit={handleSubmit(handleSendInvite)}>
              <div className="mb-4">
                <Label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">Email address</Label>
                <CustomInput 
                  id="inviteEmail"
                  placeholder="Email address" 
                  {...register("email")}
                  className="mb-1"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 mb-1">Role</Label>
                <Select 
                  onValueChange={(value) => setValue('role', value as 'ADMIN' | 'USER')}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full" id="inviteRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">Standard</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="inviteDepartment" className="block text-sm font-medium text-gray-700 mb-1">Department</Label>
                <Select 
                  onValueChange={(value) => setValue('department', value)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full" id="inviteDepartment">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GADE Team">GADE Team</SelectItem>
                    <SelectItem value="Minerals Department">Minerals Department</SelectItem>
                    <SelectItem value="Forestry Department">Forestry Department</SelectItem>
                    <SelectItem value="Ghana Armed Forces">Ghana Armed Forces</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setShowInviteModal(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90" disabled={isMutating}>
                  {isMutating ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 border border-gray-100 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-900">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleSubmitEdit(handleSaveEdit)}>
              <div className="mb-4">
                <Label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
                <Select 
                  value={editingUser.status} 
                  onValueChange={(value) => setEditValue('status', value as 'ACTIVE' | 'INACTIVE' | 'PENDING')}
                >
                  <SelectTrigger className="w-full" id="editStatus">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {errorsEdit.status && <p className="text-red-500 text-xs mt-1">{errorsEdit.status.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="editRole" className="block text-sm font-medium text-gray-700 mb-1">Role</Label>
                <Select 
                  value={editingUser.role === 'STANDARD' ? 'USER' : editingUser.role}
                  onValueChange={(value) => setEditValue('role', value as 'ADMIN' | 'USER')}
                >
                  <SelectTrigger className="w-full" id="editRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">Standard</SelectItem>
                  </SelectContent>
                </Select>
                {errorsEdit.role && <p className="text-red-500 text-xs mt-1">{errorsEdit.role.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="editDepartment" className="block text-sm font-medium text-gray-700 mb-1">Department</Label>
                <CustomInput 
                  id="editDepartment"
                  placeholder="Department" 
                  {...registerEdit("department")}
                  className="mb-1"
                />
                {errorsEdit.department && <p className="text-red-500 text-xs mt-1">{errorsEdit.department.message}</p>}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setShowEditModal(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 border border-gray-100 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-900">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete user <span className="font-bold">{deletingUser.first_name} {deletingUser.last_name} ({deletingUser.email})</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTableSection; 