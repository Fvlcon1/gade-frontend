'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconEye, IconEyeOff, IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';

type AuthFormMode = 'signin' | 'signup' | 'setup';

// Form validation schema
const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

// For sign up, extend the schema
const signUpSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  user_name: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof authSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

type CombinedFormData = SignInFormData & Partial<Omit<SignUpFormData, keyof SignInFormData>>;

type AuthFormProps = {
  mode: AuthFormMode;
  onSubmit: (data: CombinedFormData) => void;
  isLoading?: boolean;
  error?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, isLoading, error }) => {
  console.log('AuthForm - rendering with mode:', mode, 'isLoading:', isLoading, 'error:', error);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');

  const schema = mode === 'setup' ? signUpSchema : authSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CombinedFormData>({
    resolver: zodResolver(schema),
  });

  console.log('AuthForm - form errors:', errors);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const passwordCriteria = [
    { text: 'At least 8 characters', met: hasMinLength },
    { text: 'At least one uppercase letter', met: hasUppercase },
    { text: 'At least one lowercase letter', met: hasLowercase },
    { text: 'At least one number', met: hasNumber },
    { text: 'At least one special character', met: hasSpecialChar },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 w-full max-w-[320px] sm:max-w-sm mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Email input field - only render for signin mode */}
      {mode === 'signin' && (
        <div className="space-y-1.5 sm:space-y-2 text-gray-200">
          <Label htmlFor="email" className="text-sm sm:text-base">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            className={`bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-xs sm:text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
      )}

      {mode === 'setup' && (
        <>
          <div className="space-y-1.5 sm:space-y-2 text-gray-200">
            <Label htmlFor="first_name" className="text-sm sm:text-base">First Name</Label>
            <Input
              id="first_name"
              type="text"
              placeholder="John"
              {...register('first_name', { required: mode === 'setup' })}
              className={`bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base ${errors.first_name ? 'border-red-500' : ''}`}
            />
            {errors.first_name && (
              <p className="text-xs sm:text-sm text-red-400">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2 text-gray-200">
            <Label htmlFor="last_name" className="text-sm sm:text-base">Last Name</Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Doe"
              {...register('last_name', { required: mode === 'setup' })}
              className={`bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base ${errors.last_name ? 'border-red-500' : ''}`}
            />
            {errors.last_name && (
              <p className="text-xs sm:text-sm text-red-400">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2 text-gray-200">
            <Label htmlFor="user_name" className="text-sm sm:text-base">Username</Label>
            <Input
              id="user_name"
              type="text"
              placeholder="johndoe"
              {...register('user_name', { required: mode === 'setup' })}
              className={`bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base ${errors.user_name ? 'border-red-500' : ''}`}
            />
            {errors.user_name && (
              <p className="text-xs sm:text-sm text-red-400">{errors.user_name.message}</p>
            )}
          </div>
        </>
      )}

      <div className="space-y-1.5 sm:space-y-2 text-gray-200">
        <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password', {
              onChange: (e) => setPassword(e.target.value),
              required: true,
            })}
            className={`bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base ${errors.password ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <IconEyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <IconEye size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs sm:text-sm text-red-400">{errors.password.message}</p>
        )}

        {mode === 'setup' && password.length > 0 && (
          <div className="mt-2 text-xs sm:text-sm space-y-1">
            {passwordCriteria.map((criterion, index) => (
              <div key={index} className={`flex items-center ${criterion.met ? 'text-green-400' : 'text-gray-400'}`}>
                {criterion.met ? <IconCheck size={14} className="mr-2 sm:w-4 sm:h-4" /> : <IconX size={14} className="mr-2 sm:w-4 sm:h-4" />}
                <span>{criterion.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {mode === 'signin' && (
        <div className="text-right text-xs sm:text-sm">
          <Link href="#" className="font-medium text-[#D4A000] hover:text-[#F7B600]">
            Forgot password?
          </Link>
        </div>
      )}

      {mode === 'setup' && (
        <div className="space-y-1.5 sm:space-y-2 text-gray-200">
          <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword', { required: mode === 'setup' })}
              className={`bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? <IconEyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <IconEye size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs sm:text-sm text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-[#D4A000] hover:bg-[#F7B600] text-white py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
          </div>
        ) : (
          mode === 'signin' ? 'Sign In' : 'Create Account'
        )}
      </Button>
    </form>
  );
};

export default AuthForm; 