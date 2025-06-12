'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import AuthLayout from '@/components/Auth/AuthLayout';
import TwoFactorAuthForm from '@/components/Auth/TwoFactorAuthForm';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

export default function TwoFactorPage() {
  const { verifyOTP, sendOTP, isLoading, error } = useAuth();
  const { pendingLogin } = useAuthStore();
  const router = useRouter();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // If no pending login, redirect to sign in
    if (!pendingLogin) {
      router.push('/signin');
    }
  }, [pendingLogin, router]);

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyCode = async (data: { otp: string }) => {
    if (!pendingLogin?.email) return;
    try {
      await verifyOTP({ email: pendingLogin.email, otp: data.otp });
    } catch (error) {
      // Error is handled by the mutation
      console.error('Verification failed:', error);
    }
  };

  const handleResendCode = async () => {
    if (!pendingLogin?.email) return;
    sendOTP({ email: pendingLogin.email });
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Please enter the 6-digit code sent to your email or authenticator app."
      footerText="Back to"
      footerLink="/signin"
      footerLinkText="Sign in"
    >
      <TwoFactorAuthForm
        onSubmit={handleVerifyCode}
        onResendCode={handleResendCode}
        isLoading={isLoading}
        error={error?.message}
        countdown={countdown}
        canResend={canResend}
      />
    </AuthLayout>
  );
} 