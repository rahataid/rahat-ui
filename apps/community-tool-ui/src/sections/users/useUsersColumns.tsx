'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ListBeneficiary } from '@rahat-ui/types';
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

export const useUserTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => (
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
                {walletAddressCopied === row.index ? 'copied' : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
