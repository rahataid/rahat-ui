import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import { InKindLog } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

export const useInkindLogsColumn = () => {
  const columns: ColumnDef<InKindLog>[] = [
    {
      accessorKey: 'groupName',
      header: 'Group Name',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original.groupInkind.group.name}
          maxLength={20}
        />
      ),
    },

    {
      accessorKey: 'beneficiaryWallet',
      header: 'Beneficiary Wallet Address',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <TruncatedCell text={row.original.beneficiaryWallet} maxLength={10} />
          <CopyTooltip
            value={row.getValue('beneficiaryWallet')}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      accessorKey: 'inKindName',
      header: 'In-kind Name',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original.groupInkind.inkind.name}
          maxLength={15}
        />
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'In-kind Quantity',
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <TruncatedCell text={row.original.txHash || 'N/A'} maxLength={10} />
          <CopyTooltip
            value={row.getValue('txHash')}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      accessorKey: 'redeemedAt',
      header: 'Timestamp',
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row?.original?.redeemedAt
              ? dateFormat(row?.original?.redeemedAt)
              : ''
          }
          maxLength={10}
        />
      ),
    },
  ];
  return columns;
};
