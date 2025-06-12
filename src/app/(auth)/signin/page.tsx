'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AuthLayout from '@/components/Auth/AuthLayout';
import AuthForm from '@/components/Auth/AuthForm';
import type { LoginCredentials } from '@/types/auth';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (data: LoginCredentials) => {
    login(data, from);
  };

  return (
    <AuthLayout
      title="Sign in to GADE"
      subtitle="Enter your credentials to access your account"
      footerText="Don't have an account?"
      footerLink="/setup"
      footerLinkText="Set up account"
    >
      <AuthForm
        mode="signin"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error?.message}
      />
    </AuthLayout>
  );
} 