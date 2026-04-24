import { Hash } from 'lucide-react';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import { ColumnDef } from '@tanstack/react-table';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

interface TokenTransaction {
  uuid: string;
  transactionHash: string;
  from: string;
  to: string;
  blockNumber: number;
  value: string;
  blockTimeStamp: string;
}
export const useTokenTransactionHistory = () => {
  const columns: ColumnDef<TokenTransaction>[] = [
    {
      header: 'Transaction Hash',
      accessorKey: 'transactionHash',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell text={row.original?.transactionHash} maxLength={15} />
          <CopyTooltip
            value={row.original?.transactionHash}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      header: 'From',
      accessorKey: 'from',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell text={row.original?.from} maxLength={15} />
          <CopyTooltip
            value={row.original?.from}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      header: 'To',
      accessorKey: 'to',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell text={row.original?.to} maxLength={15} />
          <CopyTooltip
            value={row.original?.to}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'value',
    },
    {
      header: 'Date',
      accessorKey: 'blockTimeStamp',
      cell: ({ row }) => {
        const date = new Date(Number(row.original.blockTimeStamp) * 1000);
        const formattedDate = row.original.blockTimeStamp
          ? dateFormat(date)
          : 'N/A';
        return formattedDate;
      },
    },
  ];
  return columns;
};
