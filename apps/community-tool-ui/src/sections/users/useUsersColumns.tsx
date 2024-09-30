'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import { User } from '@rumsan/sdk/types';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useState } from 'react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import UserDetail from './viewUser';

export const useUserTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div>{row.getValue('email') ? row.getValue('email') : 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => (
        <>
          {row.getValue('wallet') ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex gap-3 cursor-pointer"
                  onClick={() => clickToCopy(row.getValue('wallet'), row.index)}
                >
                  <p>{truncateEthAddress(row.getValue('wallet'))}</p>
                  {walletAddressCopied === row.index ? (
                    <CopyCheck size={20} strokeWidth={1.5} />
                  ) : (
                    <Copy size={20} strokeWidth={1.5} />
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="bottom">
                  <p className="text-xs font-medium">
                    {walletAddressCopied === row.index
                      ? 'copied'
                      : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            'N/A'
          )}
        </>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <>
                  <UserDetail
                    userDetail={row.original}
                    closeSecondPanel={closeSecondPanel}
                  />
                </>,
              )
            }
          />
        );
      },
    },
  ];

  return columns;
};
