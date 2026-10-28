'use client';

import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { Copy, CopyCheck, X, Expand, Wallet, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import TooltipComponent from '../../components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserCurrentUser, useUserRemove } from '@rumsan/react-query';
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
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

type IProps = {
  userDetail: User;
  closeSecondPanel: VoidFunction;
};

export default function UsersDetailSplitView({
  userDetail,
  closeSecondPanel,
}: IProps) {
  const t = useTranslations('USERS_DETAIL');
  const tg = useTranslations('GLOBAL');
  const formatPhone = usePhoneFormat();
  const router = useRouter();
  const removeUser = useUserRemove();
  const currentUser = useUserCurrentUser();
  const isSelf = currentUser?.data?.data?.uuid === userDetail.uuid;

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<boolean>(false);

  const handleDeleteUser = async () => {
    await removeUser.mutateAsync(userDetail.uuid as UUID);
    closeSecondPanel();
    Swal.fire(t('USER_DELETED_SUCCESSFULLY'), '', 'success');
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
            disabled={isSelf}
          />
          <EditButton
            path={`/users/${userDetail?.uuid}/edit?split=true`}
            className="border-none p-0 shadow-none"
          />
          <TooltipComponent
            handleOnClick={() => router.push(`/users/${userDetail?.uuid}`)}
            Icon={Expand}
            tip={tg('EXPAND')}
          />
        </div>
        <TooltipComponent
          handleOnClick={closeSecondPanel}
          Icon={X}
          tip={tg('CLOSE')}
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
              <Badge>{userDetail?.extras?.status ?? tg('N_A')}</Badge>
              <p className="text-base text-muted-foreground">
                {translateValue(tg, userDetail?.gender, { fallbackStyle: 'raw' }) ||
                  tg('N_A')}
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
              {tg('GENERAL')}
            </TabsTrigger>
            <TabsTrigger
              id="usersRoles"
              className="w-full data-[state=active]:bg-white"
              value="usersRoles"
            >
              {t('USERS_ROLES')}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="general">
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="p-4 flex flex-col space-y-4">
              <h1 className="font-medium">{t('GENERAL_DETAILS')}</h1>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Wallet size={20} strokeWidth={1.5} />
                  <p>{tg('WALLET_ADDRESS')}</p>
                </div>
                <div
                  className="flex space-x-3 items-center"
                  onClick={() => clickToCopy(userDetail?.wallet as string)}
                >
                  <p className="text-muted-foreground text-base truncate w-28">
                    {(userDetail?.wallet as string) ?? '-'}
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
                  <p>{tg('PHONE_NUMBER')}</p>
                </div>
                <p className="text-muted-foreground text-base">
                  {formatPhone(userDetail?.phone) || '-'}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Mail size={20} strokeWidth={1.5} />
                  <p>{tg('EMAIL_ADDRESS')}</p>
                </div>
                <p className="text-muted-foreground text-base">
                  {userDetail?.email || '-'}
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="usersRoles">
          <UsersRolesTabSplitView userDetail={userDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
