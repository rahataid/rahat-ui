'use client';

import { SiteInfo } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ChevronDown, Languages } from 'lucide-react';

type IProps = {
  data?: SiteInfo;
};

export default function SiteInfoPreview({ data }: IProps) {
  const brandName = data?.BRAND_NAME || 'Rahat';
  const brandDescription = data?.BRAND_DESCRIPTION || '';
  const backgroundImage = data?.SITE_BACKGROUND_IMAGE || '';
  const brandLogo = data?.BRAND_LOGO || '';

  return (
    <div className="grid md:grid-cols-2 rounded-lg overflow-hidden border bg-white min-h-[640px]">
      {/* Left panel - background image with brand overlay */}
      <div className="relative min-h-[320px] md:min-h-full bg-muted">
        {backgroundImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImage}
            alt={`${brandName} background`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/50" />
        {/* Top-left brand logo */}
        <div className="absolute top-6 left-6">
          {brandLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brandLogo}
              alt={`${brandName} logo`}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-white text-2xl font-bold">{brandName}</span>
          )}
        </div>
        {/* Bottom brand description */}
        {brandDescription ? (
          <p className="absolute bottom-6 left-6 right-6 text-white text-sm leading-relaxed">
            {brandDescription}
          </p>
        ) : null}
      </div>

      {/* Right panel - sign in */}
      <div className="relative flex flex-col items-center justify-center px-6 py-10 sm:px-12">
        {/* Language selector mock */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
          <Languages size={14} />
          <span>EN</span>
          <ChevronDown size={14} />
        </div>

        {brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brandLogo}
            alt={`${brandName} logo`}
            className="h-10 w-auto object-contain mb-4"
          />
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          Welcome to {brandName}
        </h1>

        <div className="w-full max-w-md rounded-xl border p-6">
          <h2 className="text-xl font-medium text-center mb-2">Sign in</h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Enter your email address to receive unique OTP code .
          </p>
          <div className="grid gap-3">
            <Input placeholder="Email" disabled tabIndex={-1} />
            <Button disabled tabIndex={-1} className="pointer-events-none">
              Send OTP
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            By continuing, you agree to our{' '}
            <span className="underline font-medium">Terms of Service</span> and{' '}
            <span className="underline font-medium">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
