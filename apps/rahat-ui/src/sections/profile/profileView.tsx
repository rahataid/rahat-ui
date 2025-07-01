'use client';
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

export default function ProfileView() {
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
              <h1 className="text-xl">User Profile</h1>
              <EditButton path="/profile/edit" />
            </div>
          </CardTitle>
          <p className="text-base text-muted-foreground">
            Here is the overview of the user
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
                <p className="text-sm font-medium">Wallet Address</p>
              </div>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => clickToCopy(userInfo?.wallet)}
              >
                <p>{truncateEthAddress(userInfo?.wallet) || 'N/A'}</p>
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
                <p className="text-sm font-medium">Phone Number</p>
              </div>
              <p className="text-sub-label">{userInfo?.phone || 'N/A'}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-label">
                <Mail size={18} />
                <p className="text-sm font-medium">Email Address</p>
              </div>
              <p className="text-sub-label">{userInfo?.email || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
