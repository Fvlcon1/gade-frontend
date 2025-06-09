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
const signUpSchema = authSchema.extend({
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof authSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

type CombinedFormData = SignInFormData & Partial<Omit<SignUpFormData, keyof SignInFormData>>;

type AuthFormProps = {
  mode: 'signin' | 'signup';
  onSubmit: (data: CombinedFormData) => void;
  isLoading?: boolean;
  error?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');

  const schema = mode === 'signup' ? signUpSchema : authSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CombinedFormData>({
    resolver: zodResolver(schema),
  });

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {mode === 'signup' && (
        <div className="space-y-2 text-gray-200">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register('name', { required: mode === 'signup' })}
            className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2 text-gray-200">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email', { required: true })}
          className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2 text-gray-200">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password', {
              onChange: (e) => setPassword(e.target.value),
              required: true,
            })}
            className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}

        {mode === 'signup' && password.length > 0 && (
          <div className="mt-2 text-sm space-y-1">
            {passwordCriteria.map((criterion, index) => (
              <div key={index} className={`flex items-center ${criterion.met ? 'text-green-400' : 'text-gray-400'}`}>
                {criterion.met ? <IconCheck size={16} className="mr-2" /> : <IconX size={16} className="mr-2" />}
                <span>{criterion.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {mode === 'signin' && (
        <div className="text-right text-sm">
          <Link href="#" className="font-medium text-[#F7B600] hover:text-[#FFD700]">
            Forgot password?
          </Link>
        </div>
      )}

      {mode === 'signup' && (
        <div className="space-y-2 text-gray-200">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword', { required: mode === 'signup' })}
              className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-[#F7B600] hover:bg-[#FFD700] text-white py-3 rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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