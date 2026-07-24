import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import { ColumnDef } from '@tanstack/react-table';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';

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
  const params = useParams();
  const projectId = params.id as UUID;
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const columns: ColumnDef<TokenTransaction>[] = [
    {
      header: tg('TX_HASH'),
      accessorKey: 'transactionHash',
      cell: ({ row }) => {
        const txnUrl = getExplorerUrl({
          chainSettings:
            settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
          target: 'tx',
          value: row.original?.transactionHash,
        });
        return (
          <div className="flex items-center gap-2">
            <a
              href={txnUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className=" text-blue-500 hover:underline cursor-pointer"
            >
              <TruncatedCell
                text={row.original?.transactionHash}
                maxLength={15}
              />
            </a>
            <CopyTooltip
              value={row.original?.transactionHash}
              uniqueKey={row.original?.uuid}
            />
          </div>
        );
      },
    },
    {
      header: tg('FROM'),
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
      header: tg('TO'),
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
      header: tg('AMOUNT'),
      accessorKey: 'value',
      cell: ({ row }) => <div>{formatNum(row.original.value)}</div>,
    },
    {
      header: tg('DATE'),
      accessorKey: 'blockTimeStamp',
      cell: ({ row }) => {
        const date = new Date(Number(row.original.blockTimeStamp) * 1000);
        const formattedDate = row.original.blockTimeStamp
          ? formatDate(date)
          : tg('N_A');
        return formattedDate;
      },
    },
  ];
  return columns;
};
