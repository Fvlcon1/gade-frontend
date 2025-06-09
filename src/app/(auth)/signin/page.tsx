'use client';

import React from 'react';
import AuthLayout from '@/components/Auth/AuthLayout';
import AuthForm from '@/components/Auth/AuthForm';

export default function SignInPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials to access your account"
      footerText="Don't have an account?"
      footerLink="/auth/signup"
      footerLinkText="Sign up"
    >
      <AuthForm
        mode="signin"
        onSubmit={async (data) => {
          // TODO: Implement sign in logic
          console.log('Sign in data:', data);
        }}
      />
    </AuthLayout>
  );
} 