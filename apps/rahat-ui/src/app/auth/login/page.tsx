'use client';

import { useAuthStore, useLogin, useSendOtp } from '@rahat-ui/query';
import { Button, buttonVariants } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Label } from '@rahat-ui/shadcn/components/label';
import { cn } from '@rahat-ui/shadcn/src/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { paths } from '../../../routes/paths';

export default function AuthPage() {
  const router = useRouter();
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

  const sendOtpMutation = useSendOtp();
  const loginMutation = useLogin();

  const onSendOtpFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await sendOtpMutation.mutateAsync({
      address,
      service,
      clientId: '105cd449-53f6-44e4-85f3-feaa7d762ffa',
    });
  };

  useEffect(() => {
    if (sendOtpMutation.isSuccess) {
      setChallenge(sendOtpMutation.data?.data?.challenge ?? '');
    }
  }, [
    sendOtpMutation.data?.data?.challenge,
    sendOtpMutation.isSuccess,
    setChallenge,
  ]);

  const onVerifyOtpFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ otp, challenge, service });
      router.push(paths.dashboard.root);
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    }
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
              {!challenge.length ? 'Sign in' : 'OTP has been sent'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {!challenge.length
                ? 'Enter your email below to Sign in.'
                : 'Please enter the OTP sent to your email address.'}
            </p>
          </div>
          {error && (
            <p className="text-red-500 text-center">
              {error?.response?.data?.message}
            </p>
          )}
          {!challenge.length ? (
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
            <Button
              disabled={sendOtpMutation.isPending}
              onClick={onSendOtpFormSubmit}
              className="font-medium ml-2"
            >
              {!challenge.length ? 'Get Started' : 'Resend'}
            </Button>
            {challenge.length ? (
              <Button
                className="ml-2"
                onClick={() => {
                  setChallenge('');
                  router.back();
                }}
              >
                Go Back
              </Button>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}
