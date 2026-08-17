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
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import posthog from 'posthog-js';
import { useTranslations } from 'next-intl';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

export default function AuthPage() {
  const t = useTranslations('LOGIN');
  const g = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();
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
          return toast.success(t('OTP_SUCCESSFULLY_RE_SENT'));
        }
        setOtpSent(true);
      }
    });
  };

  const onVerifyOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    posthog?.setPersonProperties({
      email: address,
    });
    await verifyOtp({ otp, challenge, service });
    // router.push(paths.dashboard.root);
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
        <div className="flex flex-col gap-4 w-[450px]">
          <div className="flex flex-col space-y-2 items-center">
            <Image src={'/rahat-logo.png'} width={40} height={40} alt="" />
            <div className="text-2xl font-bold tracking-tight">
              {t('WELCOME_TO_RAHAT')}
            </div>
          </div>
          <div className="rounded-sm border shadow-sm p-4 space-y-4">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl  tracking-tight">
                {!optSent ? t('SIGN_IN') : t('VERIFY_WITH_OTP')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {!optSent
                  ? t('ENTER_YOUR_EMAIL_ADDRESS_TO_RECEIVE')
                  : t('TO_ENSURE_YOU_SECURITY_PLEASE_ENTER', { address })}
              </p>
            </div>

            {!optSent ? (
              <form onSubmit={onRequestOtp}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      {g('EMAIL')}
                    </Label>
                    <Input
                      id="email"
                      placeholder={g('EMAIL')}
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
                    {t('SEND_OTP')}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={onVerifyOtp}>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="otp">
                      {t('OTP')}
                    </Label>
                    <Input
                      id="otp"
                      placeholder={t('ENTER_OTP')}
                      type="text"
                      autoCapitalize="none"
                      autoComplete="otp"
                      autoCorrect="off"
                      value={formatDigits(otp)}
                      onChange={(e) => {
                        const integerRegex = /^\d*$/;

                        const value = toAsciiDigits(e.target.value);

                        if (integerRegex.test(value)) {
                          otpinputError && setOtpinputError(false);
                          setOtp(value);
                        } else {
                          setOtpinputError(true);
                        }
                      }}
                    />
                    {otpinputError && (
                      <div className="text-red-700 text-sm">
                        {t('PLEASE_ENTER_VALID_OTP')}
                      </div>
                    )}
                  </div>

                  <p className="px-8 text-center text-sm text-muted-foreground">
                    {t('DIDNT_GET_ONE')}
                    <span
                      className="underline font-medium ml-2 cursor-pointer"
                      onClick={(e) => {
                        setOtp('');
                        onRequestOtp(e, true);
                      }}
                    >
                      {t('RESEND_OTP')}
                    </span>
                  </p>

                  <Button type="submit" disabled={otp?.length !== 6}>
                    {t('VERIFY')}
                  </Button>
                  <Button
                    type="button"
                    variant={'outline'}
                    onClick={(e) => {
                      setOtpSent(false);
                      setOtp('');
                      setChallenge('');
                      setAddress('');
                    }}
                  >
                    {g('BACK')}
                  </Button>
                </div>
              </form>
            )}

            {!optSent && (
              <p className="text-muted-foreground text-sm">
                {t('BY_CLICKING_CONTINUE_YOU_AGREE_TO')}{' '}
                <Link
                  target="_blank"
                  href={
                    'https://docs.google.com/document/d/15eSgn1OPwsvWRU0inMOHYFgV5kvdOVA7L5LPoo6jJO0/edit'
                  }
                  className="underline font-medium"
                >
                  {t('TERMS_OF_SERVICE')}
                </Link>
                {' ' + t('AND') + ' '}
                <Link
                  target="_blank"
                  href={
                    'https://docs.google.com/document/d/1pWc5apsDdVDQvQXIaIMckGXfQo4YHs5ZoXMrKxIvdNQ/edit'
                  }
                  className="underline font-medium"
                >
                  {t('PRIVACY_POLICY')}
                </Link>
                {t('AGREE_TO_TERMS_SUFFIX')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
