'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';

export default function AuthPage() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);

  const onSendOtpFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const onVerifyOtpFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    router.push(paths.dashboard.reporting);
  };
  return (
    <div className="h-full grid place-items-center relative">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Get Started
      </Link>
      <div className="w-full flex justify-center">
        <div className="flex flex-col gap-4 w-96">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {!otpSent ? 'Sign in' : 'OTP has been sent'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {!otpSent
                ? 'Enter your email below to Sign in.'
                : 'Please enter the OTP sent to your email address.'}
            </p>
          </div>
          {!otpSent ? (
            <form onSubmit={onSendOtpFormSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>
                <Button type="submit">Send OTP</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onVerifyOtpFormSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="otp">
                    OTP
                  </Label>
                  <Input
                    id="otp"
                    placeholder="Enter OTP"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="otp"
                    autoCorrect="off"
                  />
                </div>
                <Button type="submit">Verify</Button>
              </div>
            </form>
          )}

          <p className="px-8 text-center text-sm text-muted-foreground">
            {!otpSent ? "Don't have an accoun" : "Didn't get one"}?{' '}
            <Link href="/" className="font-medium">
              {!otpSent ? 'Get Started' : 'Resend'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
