import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';

export default function useDetailsBeneficiaryTableColumn() {
  const t = useTranslations('GLOBAL');
  const formatPhone = usePhoneFormat();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: t('NAME'),
      cell: ({ row }) => row.getValue('name') || '-',
    },
    {
      accessorKey: 'phone',
      header: t('PHONE_NUMBER'),
      cell: ({ row }) => formatPhone(row.getValue('phone')) || '-',
    },
    {
      accessorKey: 'email',
      header: t('EMAIL_ADDRESS'),
      cell: ({ row }) => row.getValue('email') || '-',
    },
    {
      accessorKey: 'location',
      header: t('LOCATION'),
      cell: ({ row }) => row.getValue('location') || '-',
    },
  ];

  return columns;
}
