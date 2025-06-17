import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { 
  User, 
  AccountRegistrationRequest, 
  PaginatedResponse 
} from '@/types/auth';
import { toast } from '@/components/ui/toast';

const ACCOUNTS_QUERY_KEY = 'accounts';

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const listAccountsQuery = useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, 'list'],
    queryFn: async () => {
      try {
        const response = await apiClient.accounts.list({
          pageId: 1,
          pageSize: 10
        });
        return response;
      } catch (error) {
        toast.error({
          description: error instanceof Error ? `Failed to fetch accounts: ${error.message}` : 'An error occurred while fetching accounts',
        });
        throw error;
      }
    },
    retry: 1,
  });

  const getAccountQuery = useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, 'detail'],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await apiClient.accounts.get(queryKey[2] as string);
        return response;
      } catch (error) {
        toast.error({
          description: error instanceof Error ? `Failed to fetch account details: ${error.message}` : 'An error occurred while fetching account details',
        });
        throw error;
      }
    },
    enabled: false,
  });

  const registerAccountMutation = useMutation({
    mutationFn: apiClient.accounts.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      toast.success({
        description: 'The account has been successfully registered.',
      });
    },
    onError: (error) => {
      toast.error({
        description: error instanceof Error ? `${error.message}` : 'Failed to register account',
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: apiClient.accounts.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      toast.success({
        description: 'The account has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast.error({
        description: error instanceof Error ? `${error.message}` : 'Failed to delete account',
      });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, department }: { id: string; department: string }) => 
      apiClient.accounts.updateDepartment(id, department),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      // toast.success({
      //   description: 'The department has been successfully updated.',
      // });
    },
    onError: (error) => {
      toast.error({
        description: error instanceof Error ? `${error.message}` : 'Failed to update department',
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'ADMIN' | 'STANDARD' }) => 
      apiClient.accounts.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      // toast.success({
      //   description: 'The role has been successfully updated.',
      // });
    },
    onError: (error) => {
      toast.error({
        description: error instanceof Error ? `${error.message}` : 'Failed to update role',
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' | 'PENDING' }) => 
      apiClient.accounts.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      toast.success({
        description: 'The status has been successfully updated.',
      });
    },
    onError: (error) => {
      toast.error({
        description: error instanceof Error ? `${error.message}` : 'Failed to update status',
      });
    },
  });

  return {
    // Queries
    accounts: listAccountsQuery.data ?? [],
    isLoading: listAccountsQuery.isLoading,
    error: listAccountsQuery.error,
    refetch: listAccountsQuery.refetch,

    // Account detail
    getAccount: (id: string) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY, 'detail', id] });
      return {
        account: getAccountQuery.data,
        isLoading: getAccountQuery.isLoading,
        error: getAccountQuery.error,
      };
    },

    // Mutations
    registerAccount: registerAccountMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
    updateDepartment: updateDepartmentMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    updateStatus: updateStatusMutation.mutate,

    // Mutation states
    isMutating: 
      registerAccountMutation.isPending || 
      deleteAccountMutation.isPending || 
      updateDepartmentMutation.isPending || 
      updateRoleMutation.isPending || 
      updateStatusMutation.isPending,
    
    mutationError: 
      registerAccountMutation.error || 
      deleteAccountMutation.error || 
      updateDepartmentMutation.error || 
      updateRoleMutation.error || 
      updateStatusMutation.error,
  };
}; 