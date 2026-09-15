'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { useUserStore } from '@rumsan/react-query';
import EditButton from '../../components/edit.btn';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@rahat-ui/shadcn/src/components/ui/avatar';
import { Copy, CopyCheck, Mail, Phone, Wallet } from 'lucide-react';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

export default function ProfileView() {
  const t = useTranslations('PROFILE');
  const g = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();
  const user = useUserStore((state) => state.user);
  const userInfo = React.useMemo(() => user.data, [user]);

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };

  return (
    <div className="w-full flex justify-center mt-8">
      <Card className="shadow-md w-[500px]">
        <CardHeader className="pb-4">
          <CardTitle>
            <div className="flex justify-between items-center">
              <h1 className="text-xl">{t('USER_PROFILE')}</h1>
              <EditButton path="/profile/edit" />
            </div>
          </CardTitle>
          <p className="text-base text-muted-foreground">
            {t('HERE_IS_THE_OVERVIEW_OF_THE')}
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="pb-2">
          <div className="flex justify-center pt-4">
            <div className="flex flex-col items-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="profile-icon"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="font-medium mt-1">{userInfo?.name}</p>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardContent className="pb-2">
          <div className="p-2 flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-label">
                <Wallet size={18} />
                <p className="text-sm font-medium">{g('WALLET_ADDRESS')}</p>
              </div>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => clickToCopy(userInfo?.wallet)}
              >
                <p>{truncateEthAddress(userInfo?.wallet) || g('N_A')}</p>
                {walletAddressCopied === '4567876545' ? (
                  <CopyCheck size={15} strokeWidth={1.5} />
                ) : (
                  <Copy
                    className="text-slate-500"
                    size={15}
                    strokeWidth={1.5}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-label">
                <Phone size={18} />
                <p className="text-sm font-medium">{g('PHONE_NUMBER')}</p>
              </div>
              <p className="text-sub-label">
                {formatDigits(userInfo?.phone) || g('N_A')}
              </p>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-label">
                <Mail size={18} />
                <p className="text-sm font-medium">{g('EMAIL_ADDRESS')}</p>
              </div>
              <p className="text-sub-label">{userInfo?.email || g('N_A')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
