'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TwoFactorAuthFormProps {
  onSubmit: (data: { otp: string }) => void;
  onResendCode: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
  countdown: number;
  canResend: boolean;
}

const TwoFactorAuthForm: React.FC<TwoFactorAuthFormProps> = ({
  onSubmit,
  onResendCode,
  isLoading,
  error,
  countdown,
  canResend,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resending, setResending] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '')) {
      onSubmit({ otp: newCode.join('') });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setCode(newCode);
      if (pastedData.length === 6) {
        onSubmit({ otp: pastedData });
      }
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await onResendCode();
    } finally {
      setResending(false);
    }
  };

  return (
    <form
      className="space-y-4 w-full max-w-sm"
      onPaste={handlePaste}
      onSubmit={(e) => e.preventDefault()}
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-12 text-center text-lg bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#D4A000] focus:ring-1 focus:ring-[#D4A000] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-transparent"></div>
        </div>
      )}

      <div className="text-center text-sm text-gray-400">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-[#D4A000] hover:text-[#F7B600] font-medium"
            disabled={isLoading || resending}
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        ) : (
          <p>Resend code in {countdown}s</p>
        )}
      </div>
    </form>
  );
};

export default TwoFactorAuthForm;
