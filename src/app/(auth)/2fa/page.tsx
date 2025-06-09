'use client';

import React from 'react';
import AuthLayout from '@/components/Auth/AuthLayout';
import TwoFactorAuthForm from '@/components/Auth/TwoFactorAuthForm';

export default function TwoFactorAuthPage() {
  const handleVerifyCode = async (data: { code: string }) => {
    // TODO: Implement 2FA verification logic
    console.log('2FA Code:', data.code);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Code verified! (Simulation)');
  };

  const handleResendCode = async () => {
    // TODO: Implement resend code logic
    console.log('Resending code...');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Code resent! (Simulation)');
  };

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Please enter the 6-digit code sent to your email or authenticator app."
      footerText=""
      footerLink=""
      footerLinkText=""
    >
      <TwoFactorAuthForm
        onSubmit={handleVerifyCode}
        onResendCode={handleResendCode}
      />
    </AuthLayout>
  );
} 