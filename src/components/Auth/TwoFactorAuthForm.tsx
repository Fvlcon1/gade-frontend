'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const twoFactorAuthSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must be numeric'),
});

type TwoFactorAuthFormData = z.infer<typeof twoFactorAuthSchema>;

interface TwoFactorAuthFormProps {
  onSubmit: (data: TwoFactorAuthFormData) => void;
  isLoading?: boolean;
  error?: string;
  onResendCode?: () => void;
}

const TwoFactorAuthForm: React.FC<TwoFactorAuthFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onResendCode,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<TwoFactorAuthFormData>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    // When the OTP state changes, update the form value and trigger validation
    const fullCode = otp.join('');
    setValue('code', fullCode);
    if (fullCode.length === 6) {
      trigger('code'); // Trigger validation only when code is complete
    }
  }, [otp, setValue, trigger]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (!element.value && index > 0) {
      // This handles backspace when a field is cleared
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.preventDefault(); // Prevent default backspace behavior (e.g., navigating back)
      const newOtp = [...otp];
      newOtp[index - 1] = ''; // Clear the previous input
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2 text-gray-200">
        <Label htmlFor="code">Verification Code</Label>
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target, index)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`w-12 h-12 text-center text-lg bg-white/10 border-white/20 text-white placeholder-gray-400
              ${errors.code ? 'border-red-500 focus:border-red-500' : 'focus:border-[#F7B600]'}`}
            />
          ))}
        </div>
        {errors.code && ( // Display error message for the combined code
          <p className="text-sm text-red-400 text-center mt-2">{errors.code.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#F7B600] hover:bg-[#FFD700] text-white py-3 rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Verifying...
          </div>
        ) : (
          'Verify Code'
        )}
      </Button>

      {onResendCode && (
        <div className="text-center text-sm text-gray-300 mt-4">
          Didn't receive a code?
          <button
            type="button"
            onClick={onResendCode}
            className="font-medium text-[#F7B600] hover:text-[#FFD700] ml-1"
            disabled={isLoading}
          >
            Resend Code
          </button>
        </div>
      )}
    </form>
  );
};

export default TwoFactorAuthForm; 