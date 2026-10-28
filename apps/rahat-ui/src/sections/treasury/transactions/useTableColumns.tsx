import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export type Transaction = {
  topic: string;
  from: string;
  to: string;
  timestamp: string;
  blockNumber: string;
  transactionHash: string;
  amount: number;
};

export const useTableColumns = () => {
  const t = useTranslations('TREASURY_TRANSACTIONS');
  const tg = useTranslations('GLOBAL');
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: '__typename',
      header: tg('TOPIC'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('__typename')}</div>
      ),
    },
    {
      accessorKey: 'from',
      header: t('FROM'),
      cell: ({ row }) => (
        <div className="lowercase">
          {truncateEthAddress(row.getValue('from'))}
        </div>
      ),
    },
    {
      accessorKey: 'to',
      header: tg('TO'),
      cell: ({ row }) => (
        <div className="lowercase">
          {truncateEthAddress(row.getValue('to'))}
        </div>
      ),
    },
    {
      accessorKey: 'blockTimestamp',
      header: tg('TIMESTAMP'),
      cell: ({ row }) => <div>{row.getValue('blockTimestamp')}</div>,
    },
    {
      accessorKey: 'blockNumber',
      header: t('BLOCK_NUMBER'),
      cell: ({ row }) => <div>{row.getValue('blockNumber')}</div>,
    },
    {
      accessorKey: 'transactionHash',
      header: t('TRANSACTION_HASH'),
      cell: ({ row }) => (
        <div>{truncateEthAddress(row.getValue('transactionHash'))}</div>
      ),
    },
    {
      accessorKey: 'value',
      header: () => <div className="text-right">{t('AMOUNT')}</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('value'));

        return <div className="text-right font-medium">{amount} RHT</div>;
      },
    },
  ];
  return columns;
};
