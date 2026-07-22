'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { humanizeString } from '../../utils';
import { useTranslations } from 'next-intl';

export const useCommunityBeneficiaryTableColumns = () => {
  const t = useTranslations('Community Beneficiary Detail');
  const tg = useTranslations('GLOBAL');
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
          aria-label={tg('SELECT_ALL')}
        />
      ),
      cell: ({ row, table }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label={tg('SELECT_ROW')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: tg('BENEFICIARY_NAME'),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
    },

    {
      accessorKey: 'groupName',
      header: tg('GROUP_NAME'),
      cell: ({ row }) => <div>{humanizeString(row.getValue('groupName'))}</div>,
    },

    {
      accessorKey: 'phone',
      header: tg('PHONE'),
      cell: ({ row }) => <div>{humanizeString(row.getValue('phone'))}</div>,
    },

    {
      accessorKey: 'govtIDNumber',
      header: t('GOVT_ID_NUMBER'),
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('govtIDNumber')) || '-'}</div>
      ),
    },
  ];

  return columns;
};
