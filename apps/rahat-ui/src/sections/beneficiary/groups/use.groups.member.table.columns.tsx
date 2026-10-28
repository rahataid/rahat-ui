'use client';

import { ColumnDef } from '@tanstack/react-table';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye } from 'lucide-react';
import { ListBeneficiary } from '@rahat-ui/types';
import { useTranslations } from 'next-intl';

export const useGroupsMemberTableColumns = () => {
  const t = useTranslations('GLOBAL');
  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('SELECT_ALL')}
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t('SELECT_ROW')}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: t('NAME'),
      cell: ({ row }) => {
        row.getValue('name');
      },
    },
    {
      accessorKey: 'walletAddress',
      header: t('WALLET_ADDRESS'),
      cell: ({ row }) => (
        <p>{truncateEthAddress(row.getValue('walletAddress'))}</p>
      ),
    },
    {
      accessorKey: 'gender',
      header: t('GENDER'),
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'internetStatus',
      header: t('INTERNET_ACCESS'),
      cell: ({ row }) => <div>{row.getValue('internetStatus')}</div>,
    },
    {
      accessorKey: 'bankedStatus',
      header: t('BANKING_STATUS'),
      cell: ({ row }) => <div>{row.getValue('bankedStatus')}</div>,
    },
    {
      accessorKey: 'phoneStatus',
      header: t('PHONE_STATUS'),
      cell: ({ row }) => <div>{row.getValue('phoneStatus')}</div>,
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
          />
        );
      },
    },
  ];

  return columns;
};
