'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Text, { Head1 } from '@/app/styles/components/text';
import { TypographySize, TypographyBold } from '@/app/styles/style.types';

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
            <Head1
              textColor="white"
              bold={TypographyBold.md2}
              size={TypographySize.HL}
            >
              {title}
            </Head1>
            <Text
              textColor="rgb(209 213 219)"
              size={TypographySize.body}
              className="mt-2"
            >
              {subtitle}
            </Text>
          </div>

          {children}

          <div className="text-center">
            <Text
              textColor="rgb(209 213 219)"
              size={TypographySize.body}
            >
              {footerText}{' '}
              <Link
                href={footerLink}
                className="font-medium text-[#D4A000] hover:text-[#F7B600]"
              >
                {footerLinkText}
              </Link>
            </Text>
          </div>
        </div>
      </div>

      {/* Copyright Text */}
      <div className="absolute bottom-4 w-full text-center z-20">
        <Text
          textColor="rgb(229 231 235)"
          size={TypographySize.body}
        >
          © {new Date().getFullYear()} Blvck Sapphire Ltd
        </Text>
      </div>
    </div>
  );
};

export default AuthLayout; 