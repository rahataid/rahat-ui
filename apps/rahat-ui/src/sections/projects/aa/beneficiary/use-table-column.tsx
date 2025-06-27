'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useSecondPanel } from '../../../../providers/second-panel-provider';

import BeneficiaryDetail from './beneficiary.detail';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export const useProjectBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, id: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(id);
  };

  const openSplitDetailView = (rowDetail: any) => {
    setSecondPanelComponent(
      <BeneficiaryDetail
        closeSecondPanel={closeSecondPanel}
        beneficiaryDetails={rowDetail}
      />,
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(row?.original?.walletAddress, row?.original?.uuid)
              }
            >
              <p>{truncateEthAddress(row?.original?.walletAddress)}</p>
              {walletAddressCopied === row?.original?.uuid ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {walletAddressCopied === row?.original?.uuid
                  ? 'copied'
                  : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div> {row.getValue('email') || 'N/A'}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div> {row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div> {row.getValue('gender')}</div>,
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
