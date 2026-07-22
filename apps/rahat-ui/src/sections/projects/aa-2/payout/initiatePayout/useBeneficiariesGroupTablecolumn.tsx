import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';

export default function useBeneficiariesGroupTableColumn() {
  const tg = useTranslations('GLOBAL');
  const t = useTranslations('AA Project');
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: tg('WALLET_ADDRESS'),
      cell: ({ row }) => (
        <div className="w-80">{row?.original?.walletAddress}</div>
      ),
    },
    {
      accessorKey: 'assignedTokens',
      header: t('TOTAL_TOKEN_ASSIGNED'),
      cell: ({ row }) => <div>{row?.original?.assignedTokens}</div>,
    },
  ];

  return columns;
}
