import React from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export const useGroupedBeneficiaryTableColumns = () => {
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();
  const searchParam = useSearchParams();

  const clickToCopy = (walletAddress: string, uuid: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(uuid);
  };

  const name = searchParam.get('name');

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className={name ? '' : 'hidden'}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            className={name ? '' : 'hidden'}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') ?? 'N/A'}</div>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div>
          {row.getValue('location') ??
            row?.original?.projectData?.location ??
            'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender') ?? 'N/A'}</div>,
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
                clickToCopy(row.getValue('walletAddress'), row?.original?.uuid)
              }
            >
              <p>{truncateEthAddress(row.getValue('walletAddress'))}</p>
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
  ];
  return columns;
};
