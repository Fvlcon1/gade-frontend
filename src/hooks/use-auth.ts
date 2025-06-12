import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/components/ui/toast';
import type { LoginCredentials } from '@/types/auth';

export const useAuth = () => {
  const router = useRouter();
  const { setUser, setPendingLogin, setError, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: apiClient.auth.login,
    onSuccess: (data, variables) => {
      // Store the login credentials for 2FA
      setPendingLogin(variables);
      router.push('/2fa');
      toast.success({
        title: 'Success',
        description: 'Verify OTP to complete sign in',
      });
    },
    onError: (error) => {
      toast.error({
        title: 'Error',
        description: error.message || 'Failed to sign in',
      });
    },
  });

  const setupMutation = useMutation({
    mutationFn: apiClient.auth.setup,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success({
        title: 'Account setup complete!',
        description: 'Your account has been successfully set up.',
      });
      router.push('/');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        title: 'Setup failed',
        description: error.message || 'Please check your information and try again.',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: apiClient.auth.logout,
    onSuccess: () => {
      clearAuth();
      toast.success({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      router.push('/signin');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        title: 'Sign out failed',
        description: error.message || 'There was an error signing out.',
      });
    },
  });

  const sendOTPMutation = useMutation({
    mutationFn: apiClient.auth.sendOTP,
    onSuccess: () => {
      toast.success({
        title: 'OTP sent',
        description: 'Please check your email for the verification code.',
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        title: 'Failed to send OTP',
        description: error.message || 'Please try again later.',
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: apiClient.auth.verifyOTP,
    onSuccess: async (data, variables) => {
      // Set user and clear pending login
      setUser(data.user);
      setPendingLogin(null);
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success({
        title: 'OTP verified',
        description: 'Your account has been successfully verified.',
      });
      
      // Get the redirect URL from the pending login data
      const redirectUrl = variables.redirectUrl || '/';
      router.push(redirectUrl);
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        title: 'OTP verification failed',
        description: error.message || 'Please check the code and try again.',
      });
    },
  });

  return {
    login: (credentials: LoginCredentials, redirectUrl?: string) => {
      loginMutation.mutate({ ...credentials, redirectUrl });
    },
    setup: setupMutation.mutate,
    logout: logoutMutation.mutate,
    sendOTP: sendOTPMutation.mutate,
    verifyOTP: verifyOTPMutation.mutateAsync,
    isLoading: loginMutation.isPending || logoutMutation.isPending || 
               sendOTPMutation.isPending || verifyOTPMutation.isPending ||
               setupMutation.isPending,
    error: loginMutation.error || logoutMutation.error || 
           sendOTPMutation.error || verifyOTPMutation.error ||
           setupMutation.error,
  };
}; 