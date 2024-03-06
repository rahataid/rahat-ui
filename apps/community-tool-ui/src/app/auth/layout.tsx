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
        <div className="w-1/2 bg-login bg-cover bg-center">
          <div className="w-full h-full bg-black bg-opacity-60 p-8 flex flex-col justify-between">
            <Image
              src="/svg/rahat-logo-white.png"
              alt="rahat-logo-white"
              height={150}
              width={150}
            />
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
        </div>
        <div className="w-1/2">{children}</div>
      </div>
    </GuestGuard>
  );
}
