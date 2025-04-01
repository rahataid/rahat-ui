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
        {/* Left Section (Logo + Text) */}
        <div className="w-full md:w-1/2 bg-login bg-cover bg-center">
          <div className="w-full h-full bg-black bg-opacity-60 p-6 flex flex-col justify-between">
            <Image
              src="/svg/rahat-logo-white.png"
              alt="rahat-logo-white"
              height={100}
              width={100}
              className="mx-auto md:mx-0"
            />
            <div className="text-center md:text-left">
              <p className="text-white text-sm md:text-base w-full md:w-4/5 mx-auto">
                Rahat, an open-source blockchain-based financial access platform
                to support vulnerable communities. Our mission is to break the
                poverty cycle by providing immediate financial access, building
                resilience, and fostering financial literacy among the last
                billion.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section (Auth Form) */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-6">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
