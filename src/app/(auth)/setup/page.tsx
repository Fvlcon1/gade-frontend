'use client';

import React from 'react';
import AuthLayout from '@/components/Auth/AuthLayout';
import AuthForm from '@/components/Auth/AuthForm';

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GADE to start monitoring mining activities"
      footerText="Already have an account?"
      footerLink="/auth/signin"
      footerLinkText="Sign in"
    >
      <AuthForm
        mode="signup"
        onSubmit={async (data) => {
          // TODO: Implement sign up logic
          console.log('Sign up data:', data);
        }}
      />
    </AuthLayout>
  );
} 