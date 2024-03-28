'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ListBeneficiary } from '@rahat-ui/types';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';

export const useUserTableColumns = () => {
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
        <div>{truncateEthAddress(row.getValue('wallet'))}</div>
      ),
    },
  ];

  return columns;
};
