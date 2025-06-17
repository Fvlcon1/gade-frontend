'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AuthLayout from '@/components/Auth/AuthLayout';
import AuthForm from '@/components/Auth/AuthForm';
import type { SetupAccountRequest } from '@/types/auth';

function SetupPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { setup, isLoading, error } = useAuth();

  if (!token) {
    return (
      <AuthLayout
        title="Invalid Setup Link"
        subtitle="This setup link is invalid or has expired"
        footerText="Already have an account?"
        footerLink="/signin"
        footerLinkText="Sign in"
      >
        <div className="text-center text-gray-100 dark:text-[#8E98A3]">
          Please contact your administrator for a valid setup link.
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (data: Omit<SetupAccountRequest, 'token'>) => {
    setup({ ...data, token });
  };

  return (
    <AuthLayout
      title="Set up your account"
      subtitle="Complete your account setup to get started"
      footerText="Already have an account?"
      footerLink="/signin"
      footerLinkText="Sign in"
    >
      <AuthForm
        mode="setup"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error?.message}
      />
    </AuthLayout>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <AuthLayout
        title="Loading..."
        subtitle="Please wait while we load your setup page"
        footerText="Already have an account?"
        footerLink="/signin"
        footerLinkText="Sign in"
      >
        <div className="text-center text-gray-100 dark:text-[#8E98A3]">
          Loading...
        </div>
      </AuthLayout>
    }>
      <SetupPageContent />
    </Suspense>
  );
} 