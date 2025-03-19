'use client';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useState } from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import BeneficiaryDetail from './beneficiary.detail';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { formatEther } from 'viem';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export const useProjectBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
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
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        // const isDisabled = row.getValue('voucher') != 'Not Assigned';
        const isChecked = row.getIsSelected();
        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            // disabled={isDisabled}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(row.getValue('walletAddress'), row.index)
              }
            >
              <p>{truncateEthAddress(row.getValue('walletAddress'))}</p>
              {walletAddressCopied === row.index ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
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
      accessorKey: 'verificationStatus',
      header: 'Verification Status',
      cell: () => <Badge>Verified</Badge>,
    },
    {
      accessorKey: 'balance',
      header: () => <div>Disbursed Amount</div>,
      cell: ({ row }) => {
        const disbursementBeneficiary = row.original?.DisbursementBeneficiary;
        let amount = 0;
        if (disbursementBeneficiary?.length > 0) {
          disbursementBeneficiary.forEach((beneficiary: any) => {
            amount += Number(beneficiary.amount);
          });
        }
        return <div className="font-medium">{amount || 0} USDC</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div>Actions</div>,
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
