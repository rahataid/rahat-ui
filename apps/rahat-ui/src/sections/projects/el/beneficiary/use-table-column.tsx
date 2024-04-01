'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Copy, CopyCheck } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import BeneficiaryDetail from '../../../../sections/projects/el/beneficiary/beneficiary.detail';
import { truncateEthAddress } from '@rumsan/sdk/utils';

export const useProjectBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);
  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(true);
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Wallet',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex gap-3 cursor-pointer"
              onClick={() => clickToCopy(row.getValue('name'))}
            >
              <p>{truncateEthAddress(row.getValue('name'))}</p>
              {walletAddressCopied ? (
                <CopyCheck size={20} strokeWidth={1.5} />
              ) : (
                <Copy size={20} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">{walletAddressCopied ? 'copied' : 'click to copy'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div> {row.getValue('type')}</div>,
    },
    // {
    //   accessorKey: 'Type',
    //   header: 'Type',
    //   cell: ({ row }) => (
    //     <div className="capitalize">
    //       {row.getValue('vouvherType')
    //         ? `${row
    //             .getValue('vouvherType')
    //             ?.toString()
    //             .substring(0, 4)}....${row
    //             .getValue('vouvherType')
    //             ?.toString()
    //             ?.slice(-3)}`
    //         : 'N/A'}
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div> {row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'redemption',
      header: 'Redemption',
      cell: ({ row }) => <div> {row.getValue('redemption')}</div>,
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSecondPanelComponent(
                    <BeneficiaryDetail
                      closeSecondPanel={closeSecondPanel}
                      beneficiaryDetails={row.original}
                    />,
                  );
                }}
              >
                View Beneficiary
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
