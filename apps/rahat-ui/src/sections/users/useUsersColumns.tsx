'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@rumsan/sdk/types';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import UserDetail from './viewUser';
import { Eye, Copy, CopyCheck } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import UsersDetailSplitView from './users.detail.split.view';

export const useUserTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const openSplitDetailView = (rowDetail: User) => {
    setSecondPanelComponent(
      <UsersDetailSplitView
        userDetail={rowDetail}
        closeSecondPanel={closeSecondPanel}
      />,
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.getValue('name') ?? 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email') ?? 'N/A'}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => {
        const walletAddress = row.getValue('wallet') as string;
        return (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => clickToCopy(walletAddress, row.index)}
              >
                <p className="truncate w-48">{walletAddress}</p>
                {walletAddress ? (
                  walletAddressCopied === row.index ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-slate-500"
                      size={15}
                      strokeWidth={1.5}
                    />
                  )
                ) : (
                  'N/A'
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
        );
      },
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
            onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];

  return columns;
};
