'use client';

import Image from 'next/image';
import * as React from 'react';
import GuestGuard from '../../guards/guest-guard';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from '../../components/language-toggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('LOGIN');
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
                {t('RAHAT_AN_OPEN_SOURCE_BLOCKCHAIN_BASED')}
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 relative">
          {/* The page below is itself `relative`, so with both at `z-index: auto`
              it would paint over this toggle and swallow its clicks. */}
          <div className="absolute top-4 right-4 z-20">
            <LanguageToggle />
          </div>
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
