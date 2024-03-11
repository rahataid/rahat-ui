'use client';

import Link from 'next/link';
import { useAuthStore } from '@rumsan/react-query/auth';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Label } from '@rahat-ui/shadcn/components/label';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { paths } from '../../../routes/paths';
import { useRumsanService } from '../../../providers/service.provider';

export default function AuthPage() {
  const router = useRouter();
  const { authQuery } = useRumsanService();
  const [otp, setOtp] = useState('');
  const { address, challenge, service, setAddress, setChallenge, error } =
    useAuthStore((state) => ({
      challenge: state.challenge,
      service: state.service,
      address: state.address,
      setAddress: state.setAddress,
      setChallenge: state.setChallenge,
      error: state.error,
    }));

  const { mutateAsync: requestOtp } = authQuery.useSendOtp();
  const { mutateAsync: verifyOtp } = authQuery.useLogin();

  const onRequestOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await requestOtp({
      address,
      service,
    });
  };

  const onVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    await verifyOtp({ otp, challenge, service });
    router.push(paths.dashboard.root);
  };

  return (
    <div className="h-full grid place-items-center relative">
      {/* <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Get Started
      </Link> */}
      <div className="w-full flex justify-center">
        <div className="flex flex-col gap-4 w-96">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {!challenge.length ? 'Sign in' : 'OTP has been sent'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {!challenge.length
                ? 'Enter your email address.'
                : `OTP has been sent to ${address}`}
            </p>
          </div>

          {!challenge.length ? (
            <form onSubmit={onRequestOtp}>
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-center">
                    {error?.response?.data?.message}
                  </p>
                )}
                <Button type="submit">Send OTP</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onVerifyOtp}>
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
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <Button type="submit">Verify</Button>
              </div>
            </form>
          )}
          <p className="px-8 text-center text-sm text-muted-foreground">
            {!challenge.length ? "Don't have an account" : "Didn't get one"}?
            {/* <Button
              disabled={sendOtpMutation.isPending}
              onClick={onSendOtpFormSubmit}
              className="font-medium ml-2"
            >
              {!challenge.length ? 'Get Started' : 'Resend'}
            </Button> */}
            <span
              className="underline font-medium ml-2 cursor-pointer"
              onClick={onVerifyOtp}
            >
              {!challenge.length ? 'Get Started' : 'Resend'}
            </span>
            {challenge.length ? (
              <Button
                className="ml-2"
                onClick={() => {
                  setAddress('');
                  setChallenge('');
                }}
              >
                Go Back
              </Button>
            ) : null}
          </p>
          {!challenge.length && (
            <p className="text-muted-foreground text-sm">
              By clicking continue, you agree to our{' '}
              <span className="underline font-medium">Terms of Service</span>{' '}
              and{' '}
              <Link
                target="_blank"
                href={
                  'https://docs.google.com/document/d/1pWc5apsDdVDQvQXIaIMckGXfQo4YHs5ZoXMrKxIvdNQ/edit'
                }
                className="underline font-medium"
              >
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
