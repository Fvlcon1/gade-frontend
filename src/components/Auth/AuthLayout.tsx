'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" /> {/* Darker overlay for better contrast */}
        <Image
          src="/g1.webp"
          alt="Background"
          fill
          className="object-cover blur-[8px]"
          priority
          quality={100}
        />
      </div>

      {/* Auth Form Section - Centered */}
      <div className="relative z-20 w-full max-w-md mx-auto p-8">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-8 text-white">
          <div className="text-center">
            {/* Placeholder for Logo */}
            <div className="mb-6 flex justify-center">
              <Image
                src="/minerals.png"
                alt="Minerals Commission Ghana Logo"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-gray-300">{subtitle}</p>
          </div>

          {children}

          <p className="text-center text-sm text-gray-300">
            {footerText}{' '}
            <Link
              href={footerLink}
              className="font-medium text-[#F7B600] hover:text-[#FFD700]"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 