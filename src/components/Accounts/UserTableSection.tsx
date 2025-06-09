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
  // Define the schema for invite user form validation
  const inviteUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["super admin", "admin", "user", "viewer"], { message: "Please select a role" }),
    department: z.string().min(1, "Department is required"),
  });

  type InviteUserFormData = z.infer<typeof inviteUserSchema>;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
  });

  // Define the schema for edit user form validation
  const editUserSchema = z.object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["super admin", "admin", "user", "viewer"], { message: "Please select a role" }),
    department: z.string().min(1, "Department is required"),
  });

  type EditUserFormData = z.infer<typeof editUserSchema>;

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit, setValue } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

  const handleSendInvite = (data: InviteUserFormData) => {
    // Here you would typically call an API to send the invite
    console.log('Inviting user:', data);
    // Reset form and close modal
    reset(); // Reset form fields
    setShowInviteModal(false);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
    // Set form values when opening the edit modal
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('role', user.role);
    setValue('department', user.department);
  };

  const handleSaveEdit = (data: EditUserFormData) => {
    if (editingUser) {
      // Here you would typically call an API to update the user
      console.log('Saving edited user:', { ...editingUser, ...data });
      // Update the user in the parent component's state or context if needed
      onRoleChange(editingUser.id, data.role);
      onDepartmentChange(editingUser.id, data.department);
      // Assuming email and name are not editable from here, or handled separately
    }
    setShowEditModal(false);
    setEditingUser(null);
    resetEdit(); // Reset edit form fields
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

  // Update the actions column in UserTable component
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
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => <div className="capitalize">{row.getValue("department")}</div>,
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteClick(row.original)}>
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
                <Select onValueChange={(value: User['role']) => register("role").onChange({ target: { value } })}>
                  <SelectTrigger className="w-full" id="inviteRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="inviteDepartment" className="block text-sm font-medium text-gray-700 mb-1">Department</Label>
                <CustomInput 
                  id="inviteDepartment"
                  placeholder="Department" 
                  {...register("department")}
                  className="mb-1"
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setShowInviteModal(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[var(--color-main-primary)] text-white hover:bg-[var(--color-main-primary)]/90">
                  Send Invite
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
                <Label htmlFor="editFullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</Label>
                <CustomInput 
                  id="editFullName"
                  placeholder="Full Name" 
                  {...registerEdit("name")}
                  className="mb-1"
                />
                {errorsEdit.name && <p className="text-red-500 text-xs mt-1">{errorsEdit.name.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                <CustomInput 
                  id="editEmail"
                  placeholder="Email address" 
                  {...registerEdit("email")}
                  className="mb-1"
                />
                {errorsEdit.email && <p className="text-red-500 text-xs mt-1">{errorsEdit.email.message}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="editRole" className="block text-sm font-medium text-gray-700 mb-1">Role</Label>
                <Select value={editingUser.role} onValueChange={(value: User['role']) => setValue('role', value)}>
                  <SelectTrigger className="w-full" id="editRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
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
            <p className="text-gray-700 mb-6">Are you sure you want to delete user <span className="font-bold">{deletingUser.name} ({deletingUser.email})</span>? This action cannot be undone.</p>
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