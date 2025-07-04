import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/input/input";
import { UserTable, User } from "@components/Accounts/user-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
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
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface UserTableSectionProps {
  filteredUsers: User[];
  onStatusChange: (userId: string, newStatus: User['status']) => void;
  onRoleChange: (userId: string, newRole: User['role']) => void;
  onDepartmentChange: (userId: string, newDepartment: string) => void;
  onRemoveUser: (userId: string) => void;
  showInviteModal: boolean;
  setShowInviteModal: (show: boolean) => void;
  onInviteUser: () => void;
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
}) => {
  const { registerAccount, updateRole, updateStatus, updateDepartment, isMutating } = useAccounts();

  // Define the schema for invite user form validation
  const inviteUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "STANDARD"], { message: "Please select a role" }),
    department: z.string().min(1, "Department is required"),
  });

  type InviteUserFormData = z.infer<typeof inviteUserSchema>;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
  });

  const watchEmail = watch('email');

  // Define the schema for edit user form validation
  const editUserSchema = z.object({
    role: z.enum(["ADMIN", "STANDARD"], { message: "Please select a role" }),
    department: z.string().min(1, "Department is required"),
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
          description: 'The user has been successfully invited.',
      });

      reset();
    setShowInviteModal(false);
    } catch (error) {
      toast.error({
        description: error instanceof Error ? `${error.message}` : 'Failed to send invitation',
      });
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
    // Set form values when opening the edit modal
    setEditValue('role', user.role);
    setEditValue('department', user.department);
  };

  const handleSaveEdit = async (data: EditUserFormData) => {
    if (editingUser) {
      try {
        // Update all fields in parallel
        await Promise.all([
          updateRole({ id: editingUser.id, role: data.role }),
          updateDepartment({ id: editingUser.id, department: data.department }),
        ]);

        toast.success({
          description: 'The user has been successfully updated.',
        });

    setShowEditModal(false);
    setEditingUser(null);
        resetEdit();
      } catch (error) {
        toast.error({
          description: error instanceof Error ? `${error.message}` : 'Failed to update user',
        });
      }
    }
  };

  const handleStatusToggle = async (userId: string, newStatus: User['status']) => {
    console.log('handleStatusToggle called with:', { userId, newStatus });
    try {
      await updateStatus({ id: userId, status: newStatus });
      
      toast.success({
        description: `User is now ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      toast.error({
        description: error instanceof Error ? `${error.message}` : 'Failed to update status',
      });
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
      header: "Last Modified",
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
      accessorKey: "last_active",
      header: "Last Active",
      cell: ({ row }) => {
        const lastActive = row.original.last_active;
        if (!lastActive) return (
          <Text
            textColor="rgb(156 163 175)"
            size={TypographySize.body}
          >
            Never logged in
          </Text>
        );

        const date = parseISO(lastActive);
        const thresholdDate = new Date('2024-01-01');
        
        // If date is before 2024 or is the default zero value (Dec 31, 0001)
        if (date < thresholdDate || date.getFullYear() === 1) {
          return (
            <Text
              textColor="rgb(156 163 175)"
              size={TypographySize.body}
            >
              Never logged in
            </Text>
          );
        }

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
        const isActive = row.original.status === 'ACTIVE';
        const [showConfirm, setShowConfirm] = useState(false);
        const [pendingStatus, setPendingStatus] = useState<'ACTIVE' | 'INACTIVE' | null>(null);

        const handleToggleClick = () => {
          const targetStatus = isActive ? 'INACTIVE' : 'ACTIVE';
          console.log('handleToggleClick: Current isActive:', isActive, 'Setting pendingStatus to:', targetStatus);
          setPendingStatus(targetStatus);
          setShowConfirm(true);
        };

        const handleConfirm = async () => {
          console.log('handleConfirm: Confirming status change to:', pendingStatus);
          setShowConfirm(false);
          if (pendingStatus) {
            await handleStatusToggle(row.original.id, pendingStatus);
          }
          setPendingStatus(null);
        };

        const handleCancel = () => {
          setShowConfirm(false);
          setPendingStatus(null);
        };

        return (
        <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete user"
            >
            <IconTrash className="h-4 w-4 text-red-500" />
          </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleEditClick(row.original)}
              title="Edit user"
            >
            <IconEdit className="h-4 w-4 text-gray-600" />
            </Button>
            <div title={isActive ? "Set inactive" : "Set active"}>
              <Switch
                checked={isActive}
                onCheckedChange={handleToggleClick}
                className={`relative border cursor-pointer border-gray-200
                  data-[state=checked]:bg-green-300
                  data-[state=unchecked]:bg-red-300
                `}
              >
                <span className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0 }}
                >
                  <IconCheck className="h-3 w-3 text-white" />
                </span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200"
                  style={{ opacity: isActive ? 0 : 1 }}
                >
                  <IconX className="h-3 w-3 text-white" />
                </span>
              </Switch>
            </div>
            {/* Confirmation Dialog */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center backdrop-blur-sm justify-center bg-opacity-30">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-2">Confirm Status Change</h3>
                  <p className="mb-4">
                    {pendingStatus === 'ACTIVE'
                      ? "Do you want to activate this user's account?"
                      : "Do you want to deactivate this user's account?"}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button
                      onClick={handleConfirm}
                      className={pendingStatus === 'ACTIVE' ? "bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90" : "bg-red-500 text-white hover:bg-red-600"}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}
        </div>
        );
      },
    },
  ];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border custom-scrollbar border-gray-200 overflow-hidden">
      {/* <Tabs defaultValue="overview" className="h-full flex flex-col"> */}
        {/* <TabsContent value="overview" className="flex-1 p-4 overflow-y-auto custom-scrollbar"> */}
          <UserTable 
            data={filteredUsers}
            columns={columns}
            onStatusChange={onStatusChange}
            onRoleChange={onRoleChange}
            onDepartmentChange={onDepartmentChange}
            onRemoveUser={onRemoveUser}
            onInviteUser={onInviteUser}
          />
 

      {/* Loading Spinner */}
      {isMutating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--color-main-primary)] border-t-transparent" />
            <Text
              textColor="rgb(31 41 55)"
              size={TypographySize.body}
              bold={TypographyBold.sm2}
            >
              Updating...
            </Text>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 border border-gray-100 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-900">
            <h2 className="text-xl font-bold mb-4">Invite New User</h2>
            <form onSubmit={handleSubmit(handleSendInvite)}>
              <div className="mb-4">
                <Label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">Email address</Label>
                <CustomInput 
                  value={watchEmail}
                  placeholder="Email address" 
                  {...register("email")}
                  className="mb-1"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 mb-1">Role</Label>
                <Select 
                  onValueChange={(value) => setValue('role', value as 'ADMIN' | 'STANDARD')}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full" id="inviteRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
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
                <Label htmlFor="editRole" className="block text-sm font-medium text-gray-700 mb-1">Role</Label>
                <Select 
                  value={editingUser.role}
                  onValueChange={(value) => setEditValue('role', value as 'ADMIN' | 'STANDARD')}
                >
                  <SelectTrigger className="w-full" id="editRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                  </SelectContent>
                </Select>
                {errorsEdit.role && <p className="text-red-500 text-xs mt-1">{errorsEdit.role.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="editDepartment" className="block text-sm font-medium text-gray-700 mb-1">Department</Label>
                <Select 
                  value={editingUser.department}
                  onValueChange={(value) => setEditValue('department', value)}
                >
                  <SelectTrigger className="w-full" id="editDepartment">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GADE Team">GADE Team</SelectItem>
                    <SelectItem value="Minerals Department">Minerals Department</SelectItem>
                    <SelectItem value="Forestry Department">Forestry Department</SelectItem>
                    <SelectItem value="Ghana Armed Forces">Ghana Armed Forces</SelectItem>
                  </SelectContent>
                </Select>
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