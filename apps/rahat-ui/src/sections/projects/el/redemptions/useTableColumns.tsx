'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, CopyCheck, MoreHorizontal } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import React from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { Redemption } from './redemption.table';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@rahat-ui/shadcn/components/dropdown-menu';
import { useUpdateElRedemption } from '@rahat-ui/query';
import { useParams } from 'next/navigation';

export const useTableColumns = (handleAssignClick: any) => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const handleAssign = (row: any) => {
    handleAssignClick(row);
  };
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const uuid = useParams().id;

  const updateRedemption = useUpdateElRedemption();

  const handleApprove = async (row:any) => {
    await updateRedemption.mutateAsync({
      projectUUID: uuid,
      redemptionUUID: [row.uuid]
    });
  }

  const columns: ColumnDef<Redemption>[] = [
    {
      id: 'select',
      header: '',
      // ({ table }) => (
      //   <Checkbox
      //     checked={
      //       table.getIsAllPageRowsSelected() ||
      //       (table.getIsSomePageRowsSelected() && 'indeterminate')
      //     }
      //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //     aria-label="Select all"
      //   />
      // ),
      cell: ({ row }) => {
        const isDisabled = row.getValue('status') === 'APPROVED';
        const isChecked = row.getIsSelected() && !isDisabled;
        return (
        <Checkbox
          checked={isChecked}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled = {isDisabled}
        />)
    },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            WalletAddress
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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
      accessorKey: 'voucherType',
      header: 'Voucher Type ',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('voucherType')}</div>
      ),
    },
    {
      accessorKey: 'tokenAmount',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Token
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-1/3 text-center">{row.getValue('tokenAmount')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleApprove(rowData)}>
                Approve Redemption
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  ];

  return columns;
};
