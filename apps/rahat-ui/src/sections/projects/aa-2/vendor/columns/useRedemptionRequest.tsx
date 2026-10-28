import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserStore } from '@rumsan/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { IProjectRedemption } from '../types';
import { useTranslations } from 'next-intl';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { getAssetCode } from 'apps/rahat-ui/src/utils/stellar';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { TOKEN_TO_AMOUNT_MULTIPLIER } from '@rahat-ui/query';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';

export const useRedemptionRequestColumn = () => {
  const { id }: { id: UUID } = useParams();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const { user } = useUserStore((s) => ({ user: s.user }));
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const columns: ColumnDef<IProjectRedemption>[] = [
    {
      accessorKey: 'tokenAmount',
      header: t('TOKEN_AMOUNT'),
      cell: ({ row }) => (
        <TruncatedCell
          text={`${formatNum(Number(row.original?.tokenAmount))} ${getAssetCode(settings, id)}`}
        />
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: t('TOTAL_AMOUNT'),
      cell: ({ row }) => {
        const totalAmount = row.original?.tokenAmount
          ? Number(row.original.tokenAmount) * TOKEN_TO_AMOUNT_MULTIPLIER
          : 0;

        return (
          <TruncatedCell
            text={row.original?.tokenAmount ? `${t('RS')} ${formatNum(totalAmount)}` : tg('N_A')}
          />
        );
      },
    },
    {
      accessorKey: 'redemptionStatus',
      header: tg('STATUS'),
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
            ? t('APPROVED')
            : row.original?.redemptionStatus === 'STELLAR_VERIFIED'
            ? `${t('REQUESTED')} ✓`
            : t('REQUESTED')}
        </Badge>
      ),
    },
    {
      accessorKey: 'transactionHash',
      header: t('TX_HASH'),
      cell: ({ row }) => {
        if (!row.original?.transactionHash) {
          return <div>{t('N_A')}</div>;
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
            <CopyTooltip
              value={row.getValue('transactionHash')}
              uniqueKey={row.getValue('transactionHash')}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'approvedBy',
      header: t('APPROVED_BY'),
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row.original?.redemptionStatus === 'APPROVED'
              ? user?.data?.name || tg('N_A')
              : tg('N_A')
          }
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('REQUESTED_DATE'),
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row?.original?.createdAt ? (
            <TruncatedCell text={formatDate(row.original?.createdAt)} />
          ) : (
            tg('N_A')
          )}
        </div>
      ),
    },
    {
      accessorKey: 'approvedAt',
      header: t('APPROVED_DATE'),
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original?.redemptionStatus === 'APPROVED' &&
          row?.original?.approvedAt ? (
            <TruncatedCell text={formatDate(row.original?.approvedAt)} />
          ) : (
            tg('N_A')
          )}
        </div>
      ),
    },
  ];

  return columns;
};
