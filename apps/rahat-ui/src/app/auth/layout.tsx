'use client';

import Image from 'next/image';
import * as React from 'react';
import GuestGuard from '../../guards/guest-guard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="h-screen flex flex-col md:flex-row">
        {/* Left Section (Image) */}
        <div className="relative bg-login bg-cover bg-center w-full h-1/2 md:w-1/2 md:h-full">
          <Image
            src="/svg/rahat-logo-white.png"
            alt="rahat-logo-white"
            height={100}
            width={100}
            className="mx-auto md:mx-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center px-6">
            <p className="text-white text-center text-sm md:text-base w-full md:w-4/5">
              Rahat, an open-source blockchain-based financial access platform
              to support vulnerable communities. Our mission is to break the
              poverty cycle by providing immediate financial access, building
              resilience, and fostering financial literacy among the last
              billion.
            </p>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full h-1/2 md:w-1/2 md:h-full flex justify-center items-center p-6">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
