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
  // const { authQuery } = useRumsanService();
  const [isEmailValid, setIsEmailValid] = React.useState<boolean>(false);
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

  const { mutateAsync: requestOtp, isSuccess, isPending } = useRequestOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtp();

  const onRequestOtp = async (e: React.SyntheticEvent, resendOtp?: boolean) => {
    e.preventDefault();
    await requestOtp({
      address,
      service,
    }).then((data) => {
      if (data.data.challenge) {
        if (resendOtp) {
          return toast.success('Otp successfully re-sent');
        }
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
              {!optSent ? 'Sign in' : 'OTP has been sent'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {!optSent
                ? 'Enter your email address.'
                : `OTP has been sent to ${address}`}
            </p>
          </div>

          {!optSent ? (
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
                <Button
                  type="submit"
                  disabled={isPending || !isEmailValid || !address}
                >
                  Send OTP
                </Button>
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
                    onChange={(e) => {
                      const integerRegex = /^\d*$/;

                      const value = e.target.value;

                      if (integerRegex.test(value)) {
                        otpinputError && setOtpinputError(false);
                        setOtp(e.target.value);
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
                </div>
                <Button type="submit" disabled={otp?.length !== 6}>
                  Verify
                </Button>
              </div>
            </form>
          )}

          {optSent && (
            <p className="px-8 text-center text-sm text-muted-foreground">
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

          {!optSent && (
            <p className="text-muted-foreground text-sm">
              By clicking continue, you agree to our
              <span className="font-medium">
                <Link
                  target="_blank"
                  href={
                    'https://docs.google.com/document/d/15eSgn1OPwsvWRU0inMOHYFgV5kvdOVA7L5LPoo6jJO0/edit'
                  }
                  className="underline font-medium"
                >
                  Terms of Service
                </Link>
              </span>
              {''} and {''}
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
