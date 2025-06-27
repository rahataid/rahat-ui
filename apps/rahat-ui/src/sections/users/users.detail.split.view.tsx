'use client';

import { UUID } from 'crypto';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { Copy, CopyCheck, X, Expand, Wallet, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import TooltipComponent from '../../components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserRemove } from '@rumsan/react-query';
import { User } from '@rumsan/sdk/types';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import React from 'react';
import UsersRolesTabSplitView from './users.roles.tab.split.view';
import Swal from 'sweetalert2';
import DeleteButton from '../../components/delete.btn';
import EditButton from '../../components/edit.btn';

type IProps = {
  userDetail: User;
  closeSecondPanel: VoidFunction;
};

export default function UsersDetailSplitView({
  userDetail,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  const removeUser = useUserRemove();

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<boolean>(false);

  const handleDeleteUser = async () => {
    await removeUser.mutateAsync(userDetail.uuid as UUID);
    closeSecondPanel();
    Swal.fire('User Deleted Successfully', '', 'success');
  };

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(true);
  };

  return (
    <div className="h-full border-l">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <DeleteButton
            className="border-none p-0 shadow-none"
            name="user"
            handleContinueClick={handleDeleteUser}
          />
          <EditButton
            path={`/users/${userDetail?.uuid}/edit`}
            className="border-none p-0 shadow-none"
          />
          <TooltipComponent
            handleOnClick={() => router.push(`/users/${userDetail?.uuid}`)}
            Icon={Expand}
            tip="Expand"
          />
        </div>
        <TooltipComponent
          handleOnClick={closeSecondPanel}
          Icon={X}
          tip="Close"
        />
      </div>
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="profile"
            height={80}
            width={80}
          />
          <div>
            <h1 className="font-semibold text-xl mb-1">{userDetail?.name}</h1>
            <div className="flex space-x-4 items-center">
              <Badge>{userDetail?.extras?.status ?? 'N/A'}</Badge>
              <p className="text-base text-muted-foreground">
                {userDetail?.gender ?? 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="general">
        <div className="flex justify-between items-center p-4">
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              id="general"
              className="w-full data-[state=active]:bg-white"
              value="general"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              id="usersRoles"
              className="w-full data-[state=active]:bg-white"
              value="usersRoles"
            >
              Users Roles
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="general">
          <div className="p-4 flex flex-col space-y-4">
            <h1 className="font-medium">General Details</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Wallet size={20} strokeWidth={1.5} />
                <p>Wallet Address</p>
              </div>
              <div
                className="flex space-x-3 items-center"
                onClick={() => clickToCopy(userDetail?.wallet as string)}
              >
                <p className="text-muted-foreground text-base">
                  {truncateEthAddress(userDetail?.wallet as string) ?? '-'}
                </p>
                {userDetail?.wallet &&
                  (walletAddressCopied ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-muted-foreground"
                      size={15}
                      strokeWidth={1.5}
                    />
                  ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Phone size={20} strokeWidth={1.5} />
                <p>Phone Number</p>
              </div>
              <p className="text-muted-foreground text-base">
                {userDetail?.phone || '-'}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Mail size={20} strokeWidth={1.5} />
                <p>Email Address</p>
              </div>
              <p className="text-muted-foreground text-base">
                {userDetail?.email || '-'}
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="usersRoles">
          <UsersRolesTabSplitView userDetail={userDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
