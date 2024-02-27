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
      <div className="h-screen flex">
        <div className="w-1/2 bg-black  p-8 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/svg/rahat-logo-white.svg"
              alt="rahat-logo-white"
              height={50}
              width={50}
            />
            <p className="font-medium text-white text-lg">Rahat</p>
          </div>
          <div>
            <p className="text-white w-4/5">
              Rahat, an open-source blockchain-based financial access platform
              to support vulnerable communities. Our mission is to break the
              poverty cycle by providing immediate financial access, building
              resilience, and fostering financial literacy among the last
              billion.
            </p>
          </div>
        </div>
        <div className="w-1/2">{children}</div>
      </div>
    </GuestGuard>
  );
}
