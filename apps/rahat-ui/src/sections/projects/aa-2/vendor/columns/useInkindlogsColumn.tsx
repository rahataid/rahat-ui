import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import { InKindLog } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { UUID } from 'crypto';

export const useInkindLogsColumn = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const getTxUrl = (txHash?: string | null) =>
    getExplorerUrl({
      chainSettings:
        settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
      target: 'tx',
      value: txHash || '',
    });

  const columns: ColumnDef<InKindLog>[] = [
    {
      accessorKey: 'groupName',
      header: tg('GROUP_NAME'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original.groupInkind.group.name}
          maxLength={20}
        />
      ),
    },

    {
      accessorKey: 'beneficiaryWallet',
      header: t('BENEFICIARY_WALLET_ADDRESS'),
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
      header: t('IN_KIND_NAME'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original.groupInkind.inkind.name}
          maxLength={15}
        />
      ),
    },
    {
      accessorKey: 'quantity',
      header: t('IN_KIND_QUANTITY'),
      cell: ({ row }) => <div>{formatNum(row.original.quantity)}</div>,
    },
    {
      accessorKey: 'txHash',
      header: t('TX_HASH'),
      cell: ({ row }) => {
        const txHash = row.original.txHash;
        const txnUrl = getTxUrl(txHash);

        return (
          <div className="flex gap-2 items-center">
            {txHash ? (
              <a
                href={txnUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline cursor-pointer"
              >
                <TruncatedCell text={txHash} maxLength={10} />
              </a>
            ) : (
              <TruncatedCell text={tg('N_A')} maxLength={10} />
            )}
            <CopyTooltip
              value={row.getValue('txHash')}
              uniqueKey={row.original?.uuid}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'redeemedAt',
      header: tg('TIMESTAMP'),
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row?.original?.redeemedAt
              ? formatDate(row?.original?.redeemedAt)
              : ''
          }
          maxLength={10}
        />
      ),
    },
  ];
  return columns;
};
