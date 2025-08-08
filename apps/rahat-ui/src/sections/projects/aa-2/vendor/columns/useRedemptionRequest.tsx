import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserStore } from '@rumsan/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { IProjectRedemption } from '../types';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { useProjectSettingsStore } from '@rahat-ui/query';
import { getAssetCode } from 'apps/rahat-ui/src/utils/stellar';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { TOKEN_TO_AMOUNT_MULTIPLIER } from '@rahat-ui/query';

export const useRedemptionRequestColumn = () => {
  const { id }: { id: UUID } = useParams();
  const { user } = useUserStore((s) => ({ user: s.user }));
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const columns: ColumnDef<IProjectRedemption>[] = [
    {
      accessorKey: 'tokenAmount',
      header: 'Token Amount',
      cell: ({ row }) => (
        <div>
          {row.original.tokenAmount} {getAssetCode(settings, id)}
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => (
        <div>
          {row.original?.totalAmount
            ? `Rs. ${
                Number(row.original?.totalAmount) * TOKEN_TO_AMOUNT_MULTIPLIER
              }`
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'redemptionStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className="text-xs font-normal"
          style={{
            backgroundColor:
              row.original?.redemptionStatus === 'APPROVED'
                ? '#ECFDF3'
                : '#EFF8FF',
            color:
              row.original?.redemptionStatus === 'APPROVED'
                ? '#027A48'
                : '#175CD3',
          }}
        >
          {row.original?.redemptionStatus === 'APPROVED'
            ? 'Approved'
            : row.original?.redemptionStatus === 'STELLAR_VERIFIED'
            ? 'Requested*'
            : 'Requested'}
        </Badge>
      ),
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original?.redemptionStatus === 'APPROVED'
            ? user?.data?.name || 'N/A'
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Requested Date',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row?.original?.createdAt
            ? dateFormat(row.original?.createdAt)
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'approvedAt',
      header: 'Approved Date',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original?.redemptionStatus === 'APPROVED' &&
          row?.original?.approvedAt
            ? dateFormat(row.original?.approvedAt)
            : 'N/A'}
        </div>
      ),
    },
  ];

  return columns;
};
