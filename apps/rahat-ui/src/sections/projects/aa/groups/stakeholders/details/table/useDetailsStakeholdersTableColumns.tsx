import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import { whitespaceInsensitiveFilter } from 'apps/rahat-ui/src/utils/table.filters';

export default function useDetailsStakeholdersTableColumn() {
  const tg = useTranslations('GLOBAL');
  const t = useTranslations('AA_PROJECT');
  const formatPhone = usePhoneFormat();
  const columns: ColumnDef<IStakeholdersItem>[] = [
    {
      accessorKey: 'name',
      header: tg('NAME'),
      filterFn: whitespaceInsensitiveFilter,
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: tg('PHONE'),
      filterFn: whitespaceInsensitiveFilter,
      cell: ({ row }) => (
        <div>{formatPhone(row.getValue('phone')) || tg('N_A')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: tg('EMAIL_ADDRESS'),
      filterFn: whitespaceInsensitiveFilter,
      cell: ({ row }) => <div>{row.getValue('email') || tg('N_A')}</div>,
    },
    {
      accessorKey: 'designation',
      header: t('DESIGNATION'),
      filterFn: whitespaceInsensitiveFilter,
      cell: ({ row }) => <div>{row.getValue('designation')}</div>,
    },
    {
      accessorKey: 'organization',
      header: tg('ORGANIZATION'),
      filterFn: whitespaceInsensitiveFilter,
      cell: ({ row }) => <div>{row.getValue('organization')}</div>,
    },
    {
      accessorKey: 'district',
      header: t('DISTRICT'),
      filterFn: whitespaceInsensitiveFilter,
      cell: ({ row }) => <div>{row.getValue('district')}</div>,
    },
    {
      accessorKey: 'municipality',
      header: tg('MUNICIPALITY'),
      filterFn: whitespaceInsensitiveFilter,
      cell: ({ row }) => <div>{row.getValue('municipality')}</div>,
    },
  ];

  return columns;
}
