'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye } from 'lucide-react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';

export const useTargetingColumns = () => {
  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      header: 'Household Head Name',
      cell: ({ row }) => (
        <div>
          {row.original.firstName} {row.original.lastName}
        </div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <div>{truncateEthAddress(row.getValue('walletAddress'))}</div>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'internetStatus',
      header: 'Internet Access',
      cell: ({ row }) => <div>{row.getValue('internetStatus')}</div>,
    },
    {
      accessorKey: 'phoneStatus',
      header: 'Phone Type',
      cell: ({ row }) => <div>{row.getValue('phoneStatus')}</div>,
    },
    {
      accessorKey: 'bankedStatus',
      header: 'Banking Status',
      cell: ({ row }) => <div>{row.getValue('bankedStatus')}</div>,
    },
  ];

  return columns;
};
