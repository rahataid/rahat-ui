'use client';

import * as React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen p-2 flex">
      <div className="w-1/2 bg-black rounded p-8 flex flex-col justify-between">
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
          <p className="text-white w-1/2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s,
          </p>
        </div>
      </div>
      <div className="w-1/2">{children}</div>
    </div>
  );
}
