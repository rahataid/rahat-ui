'use client';

import Link from 'next/link';
import {
  useAuthStore,
  useRequestOtp,
  useVerifyOtp,
} from '@rumsan/react-query/auth';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Label } from '@rahat-ui/shadcn/components/label';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { paths } from '../../../routes/paths';
import { toast } from 'react-toastify';

export default function AuthPage() {
  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpinputError, setOtpinputError] = useState(false);
  const [optSent, setOtpSent] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { address, challenge, service, setAddress, setChallenge, error } =
    useAuthStore((state) => ({
      challenge: state.challenge,
      service: state.service,
      address: state.address,
      setAddress: state.setAddress,
      setChallenge: state.setChallenge,
      error: state.error,
    }));

  const { mutateAsync: requestOtp, isPending } = useRequestOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtp();

  const onRequestOtp = async (e: React.SyntheticEvent, resendOtp?: boolean) => {
    e.preventDefault();
    await requestOtp({ address, service }).then((data) => {
      if (data.data.challenge) {
        if (resendOtp) return toast.success('OTP successfully re-sent');
        setOtpSent(true);
      }
    });
  };

  const onVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await verifyOtp({ otp, challenge, service });
    router.push(paths.dashboard.root);
  };

  React.useEffect(() => {
    if (address) {
      setIsEmailValid(emailRegex.test(address));
    }
  }, [address]);

  return (
    <div className="sm:h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            {!optSent ? 'Sign in' : 'OTP has been sent'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {!optSent
              ? 'Enter your email address.'
              : `OTP has been sent to ${address}`}
          </p>
        </div>

        {/* Email Form */}
        {!optSent ? (
          <form onSubmit={onRequestOtp} className="mt-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                autoComplete="email"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {error && (
                <p className="text-red-500 text-center">
                  {error?.response?.data?.message}
                </p>
              )}
              <Button
                type="submit"
                disabled={isPending || !isEmailValid || !address}
              >
                Send OTP
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={onVerifyOtp} className="mt-4">
            <div className="grid gap-2">
              <Label htmlFor="otp" className="sr-only">
                OTP
              </Label>
              <Input
                id="otp"
                placeholder="Enter OTP"
                type="text"
                autoComplete="otp"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    otpinputError && setOtpinputError(false);
                    setOtp(value);
                  } else {
                    setOtpinputError(true);
                  }
                }}
              />
              {otpinputError && (
                <div className="text-red-700 text-sm">
                  Please enter valid OTP
                </div>
              )}
              <Button type="submit" disabled={otp?.length !== 6}>
                Verify
              </Button>
            </div>
          </form>
        )}

        {/* Resend OTP */}
        {optSent && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Didn't get one?
            <span
              className="underline font-medium ml-2 cursor-pointer"
              onClick={(e) => {
                setOtp('');
                onRequestOtp(e, true);
              }}
            >
              Resend
            </span>
          </p>
        )}

        {/* Terms & Privacy */}
        {!optSent && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            By clicking continue, you agree to our{' '}
            <span className="font-medium">Terms of Service</span> and{' '}
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
  );
}
