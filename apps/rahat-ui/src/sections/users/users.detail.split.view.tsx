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
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full border-2 border-primary/20 shadow-sm"
            src="/profile.png"
            alt="profile"
            height={80}
            width={80}
          />
          <div>
            <h1 className="mb-2 text-xl font-semibold">{userDetail?.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{userDetail?.extras?.status ?? tg('N_A')}</Badge>
              <span className="rounded-full border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
                {translateValue(tg, userDetail?.gender, { fallbackStyle: 'raw' }) ||
                  tg('N_A')}
              </span>
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
            <div className="flex flex-col gap-4 p-4">
              <section className="rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="mb-4 border-l-4 border-primary pl-3 text-base font-semibold">
                  {t('GENERAL_DETAILS')}
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                    <div className="flex shrink-0 items-center gap-3">
                      <Wallet
                        className="rounded-md bg-secondary p-1 text-primary"
                        size={24}
                        strokeWidth={1.5}
                      />
                      <p className="text-sm font-medium">
                        {tg('WALLET_ADDRESS')}
                      </p>
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      <p className="w-28 truncate text-right text-sm text-muted-foreground">
                        {(userDetail?.wallet as string) ?? '-'}
                      </p>
                      {userDetail?.wallet && (
                        <button
                          type="button"
                          onClick={() =>
                            clickToCopy(userDetail?.wallet as string)
                          }
                          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={tg('WALLET_ADDRESS')}
                        >
                          {walletAddressCopied ? (
                            <CopyCheck size={16} strokeWidth={1.5} />
                          ) : (
                            <Copy size={16} strokeWidth={1.5} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                    <div className="flex shrink-0 items-center gap-3">
                      <Phone
                        className="rounded-md bg-secondary p-1 text-primary"
                        size={24}
                        strokeWidth={1.5}
                      />
                      <p className="text-sm font-medium">
                        {tg('PHONE_NUMBER')}
                      </p>
                    </div>
                    <p className="break-all text-right text-sm text-muted-foreground">
                      {formatPhone(userDetail?.phone) || '-'}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                    <div className="flex shrink-0 items-center gap-3">
                      <Mail
                        className="rounded-md bg-secondary p-1 text-primary"
                        size={24}
                        strokeWidth={1.5}
                      />
                      <p className="text-sm font-medium">
                        {tg('EMAIL_ADDRESS')}
                      </p>
                    </div>
                    <p className="break-all text-right text-sm text-muted-foreground">
                      {userDetail?.email || '-'}
                    </p>
                  </div>
                </div>
              </section>
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
