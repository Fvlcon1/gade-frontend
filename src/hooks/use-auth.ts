import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/components/ui/toast';
import type { LoginCredentials, SetupAccountRequest } from '@/types/auth';
import Cookies from "universal-cookie"
import { setupInterceptors } from '@/utils/apis/axiosInstance';

const cookies = new Cookies();

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
        description: 'Success: Verify OTP to complete sign in',
      });
    },
    onError: (error) => {
      toast.error({
        description: error.message || 'Failed to sign in',
      });
    },
  });

  const setupMutation = useMutation({
    mutationFn: (data: SetupAccountRequest) => {
      console.log('useAuth - setupMutation - mutationFn called with data:', data);
      return apiClient.auth.setup(data);
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success({
        description: 'Account setup complete! Your account has been successfully set up.',
      });
      router.push('/signin');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        description: error.message || 'Setup failed: Please check your information and try again.',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: apiClient.auth.logout,
    onSuccess: () => {
      clearAuth();
      toast.success({
        description: 'Signed out: You have been successfully signed out.',
      });
      router.push('/signin');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        description: error.message || 'Sign out failed: There was an error signing out.',
      });
    },
  });

  const sendOTPMutation = useMutation({
    mutationFn: apiClient.auth.sendOTP,
    onSuccess: () => {
      toast.success({
        description: 'OTP sent: Please check your email for the verification code.',
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        description: error.message || 'Failed to send OTP: Please try again later.',
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: apiClient.auth.verifyOTP,
    onSuccess: async (data, variables) => {
      cookies.set('access_token', data.access_token);
      cookies.set("refresh_token", data.refresh_token)
      
      // Set user and clear pending login
      setUser(data.user);
      setPendingLogin(null);
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success({
        description: 'OTP verified: Your account has been successfully verified.',
      });
      
      // Get the redirect URL from the pending login data
      // const redirectUrl = variables.redirectUrl || '/';
      router.push("/");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error({
        description: error.message || 'OTP verification failed: Please check the code and try again.',
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