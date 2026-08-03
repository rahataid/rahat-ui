import { useTranslations } from 'next-intl';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/usePhoneFormat';

export default function useMembersTableColumn() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatPhone = usePhoneFormat();
  const columns: ColumnDef<IStakeholdersItem>[] = [
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={tg('SELECT_ROW')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: tg('NAME'),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: tg('PHONE'),
      cell: ({ row }) => <div>{formatPhone(row.getValue('phone')) || tg('N_A')}</div>,
    },
    {
      accessorKey: 'email',
      header: tg('EMAIL_ADDRESS'),
      cell: ({ row }) => <div>{row.getValue('email') || tg('N_A')}</div>,
    },
    {
      accessorKey: 'designation',
      header: t('DESIGNATION'),
      cell: ({ row }) => <div>{row.getValue('designation')}</div>,
    },
    {
      accessorKey: 'organization',
      header: t('ORGANIZATION'),
      cell: ({ row }) => <div>{row.getValue('organization')}</div>,
    },
    {
      accessorKey: 'district',
      header: t('DISTRICT'),
      cell: ({ row }) => <div>{row.getValue('district')}</div>,
    },
    {
      accessorKey: 'municipality',
      header: t('MUNICIPALITY'),
      cell: ({ row }) => <div>{row.getValue('municipality')}</div>,
    },
  ];

  return columns;
}
