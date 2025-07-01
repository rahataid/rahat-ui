'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export type VendorType = {
  name: string;
  walletaddress: string;
};

interface VendorTableProps {
  handleViewClick: any;
  voucherPrice: number;
}

export const useVendorTable = ({
  handleViewClick,
  voucherPrice,
}: VendorTableProps) => {
  const columns: ColumnDef<VendorType>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'totalVoucherRedemmed',
      header: 'Total Vouchers Redeemed',
      cell: ({ row }) => <div>{row.getValue('totalVoucherRedemmed')}</div>,
    },

    {
      accessorKey: 'redemmedValue',
      header: 'Redeemed Value',
      cell: ({ row }) => (
        <div>{Number(row.getValue('totalVoucherRedemmed')) * voucherPrice}</div>
      ),
    },

    {
      accessorKey: 'redemptionNumber',
      header: 'Claims Value',
      cell: ({ row }) => (
        <div>{Number(row.getValue('redemptionNumber')) * voucherPrice}</div>
      ),
    },
    {
      accessorKey: 'approvedStatus',
      header: () => <div className="text-right">Approved Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue('approvedStatus')}
          </div>
        );
      },
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
              <DropdownMenuItem onClick={() => handleViewClick(rowData)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
