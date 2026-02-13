import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserStore } from '@rumsan/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { IProjectRedemption } from '../types';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { getAssetCode } from 'apps/rahat-ui/src/utils/stellar';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { TOKEN_TO_AMOUNT_MULTIPLIER } from '@rahat-ui/query';
import { Copy, CopyCheck } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export const useRedemptionRequestColumn = () => {
  const { id }: { id: UUID } = useParams();
  const { user } = useUserStore((s) => ({ user: s.user }));
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { clickToCopy, copyAction } = useCopy();

  const columns: ColumnDef<IProjectRedemption>[] = [
    {
      accessorKey: 'tokenAmount',
      header: 'Token Amount',
      cell: ({ row }) => (
        <TruncatedCell
          text={`${row.original?.tokenAmount} ${getAssetCode(settings, id)}`}
          maxLength={20}
        />
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row.original?.tokenAmount
              ? `Rs. ${
                  Number(row.original?.tokenAmount) * TOKEN_TO_AMOUNT_MULTIPLIER
                }`
              : 'N/A'
          }
          maxLength={20}
        />
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
            ? 'Requested ✓'
            : 'Requested'}
        </Badge>
      ),
    },
    {
      accessorKey: 'transactionHash',
      header: 'TxHash',
      cell: ({ row }) => {
        if (!row.original?.transactionHash) {
          return <div>N/A</div>;
        }
        return (
          <div className="flex flex-row">
            <div className="w-20 truncate">
              <a
                href={
                  getExplorerUrl({
                    chainSettings:
                      settings?.[id]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
                    target: 'tx',
                    value: row.original?.transactionHash,
                  }) || '#'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-500 hover:underline cursor-pointer "
              >
                <TruncatedCell
                  text={row.getValue('transactionHash')}
                  maxLength={10}
                />
              </a>
            </div>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    clickToCopy(
                      row.getValue('transactionHash'),
                      row.getValue('transactionHash'),
                    )
                  }
                >
                  {copyAction === row.getValue('transactionHash') ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-slate-500"
                      size={15}
                      strokeWidth={1.5}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className=" rounded-sm" side="bottom">
                  <p className="text-xs font-medium">
                    {copyAction === row.getValue('transactionHash')
                      ? 'copied'
                      : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row.original?.redemptionStatus === 'APPROVED'
              ? user?.data?.name || 'N/A'
              : 'N/A'
          }
          maxLength={20}
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Requested Date',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row?.original?.createdAt ? (
            <TruncatedCell
              text={dateFormat(row.original?.createdAt)}
              maxLength={20}
            />
          ) : (
            'N/A'
          )}
        </div>
      ),
    },
    {
      accessorKey: 'approvedAt',
      header: 'Approved Date',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original?.redemptionStatus === 'APPROVED' &&
          row?.original?.approvedAt ? (
            <TruncatedCell
              text={dateFormat(row.original?.approvedAt)}
              maxLength={20}
            />
          ) : (
            'N/A'
          )}
        </div>
      ),
    },
  ];

  return columns;
};
