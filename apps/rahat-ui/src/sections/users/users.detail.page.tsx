import { useTranslations } from 'next-intl';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import React from 'react';
import { Copy, CopyCheck, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import HeaderWithBack from '../projects/components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import CoreBtnComponent from '../../components/core.btn';
import SearchInput from '../projects/components/search.input';
import DemoTable from '../../components/table';
import { useUsersRolesTableColumns } from './use.users.roles.table.columns';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  useUserStore,
  useUserRoleList,
  useUserRemove,
  useUserGet,
} from '@rumsan/react-query';
import AssignRoleDialog from './assign.role.dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import Swal from 'sweetalert2';
import { User } from '@rumsan/sdk/types';

export default function UsersDetailPage() {
  const t = useTranslations('Users – Detail');
  const tc = useTranslations('Confirmation & Alert Dialogs');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams() as { id: UUID };
  const router = useRouter();

  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const loggedUserRoles = React.useMemo(() => user?.data?.roles, [user]);

  const { data: userDetail } = useUserGet(id);
  const User = React.useMemo(() => userDetail?.data, [userDetail?.data]);

  const { data: roleList, isLoading } = useUserRoleList(id);

  const removeUser = useUserRemove();

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };

  const columns = useUsersRolesTableColumns({ loggedUserRoles, userUUID: id });
  const table = useReactTable({
    manualPagination: true,
    data: roleList?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const deleteUser = () => {
    removeUser.mutate(id, {
      onSuccess: () => {
        Swal.fire(t('USER_DELETED_SUCCESSFULLY'), '', 'success');
        router.push('/users');
      },
    });
  };

  const renderAlertContent = ({
    handleContinueClick,
  }: {
    handleContinueClick: () => void;
  }) => {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tg('ARE_YOU_ABSOLUTELY_SURE')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('THIS_ACTION_CANNOT_BE_UNDONE')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tg('CANCEL')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueClick}>
            {tg('CONTINUE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <HeaderWithBack
            title={t('USER_DETAILS')}
            subtitle={t('HERE_IS_A_DETAILED_VIEW_OF')}
            path="/users"
          />
          <div className="flex space-x-2">
            <CoreBtnComponent
              className="text-primary bg-sky-50"
              name={t('ASSIGN_TO_PROJECT')}
              Icon={FolderPlus}
              handleClick={() => undefined}
              disabled
            />

            <AlertDialog>
              <AlertDialogTrigger className="flex items-center">
                <Button variant="secondary">
                  <Pencil className="mr-1" size={18} strokeWidth={1.5} />
                  {tg('EDIT')}
                </Button>
              </AlertDialogTrigger>
              {renderAlertContent({
                handleContinueClick: () => router.push(`/users/${id}/edit`),
              })}
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger className="flex items-center">
                <Button variant="secondary" className="text-red-500 bg-red-100">
                  <Trash2 className="mr-1" size={18} strokeWidth={1.5} />
                  {tg('DELETE')}
                </Button>
              </AlertDialogTrigger>
              {renderAlertContent({ handleContinueClick: deleteUser })}
            </AlertDialog>
          </div>
        </div>
        <div className="p-5 rounded-md shadow border grid grid-cols-4 gap-5">
          <div>
            <h1 className="text-md text-muted-foreground">{tg('NAME')}</h1>
            <p className="font-medium">{User?.name || tg('N_A')}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">{tg('GENDER')}</h1>
            <p className="font-medium">{User?.gender || tg('N_A')}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">{tg('PHONE_NUMBER')}</h1>
            <p className="font-medium">{User?.phone || tg('N_A')}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">{tg('EMAIL_ADDRESS')}</h1>
            <p className="font-medium">{User?.email || tg('N_A')}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">{tg('WALLET_ADDRESS')}</h1>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => clickToCopy(User?.wallet as string)}
            >
              <p className="text-muted-foreground text-base truncate w-48">
                {User?.wallet as string}
              </p>
              {walletAddressCopied === User?.wallet ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 text-lg">
          <h1 className="font-medium mb-4">{t('USER_ROLES')}</h1>
          <div className="border rounded-md p-4">
            <div className="flex space-x-2">
              <SearchInput
                className="w-full"
                name={tg('ROLE')}
                onSearch={() => undefined}
                isDisabled
              />
              {(loggedUserRoles?.includes('Admin') ||
                loggedUserRoles?.includes('Manager')) && (
                <AssignRoleDialog userDetails={User as User} />
              )}
            </div>
            <DemoTable
              table={table}
              tableHeight="h-[calc(100vh-517px)]"
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
