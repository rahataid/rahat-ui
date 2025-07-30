import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { Copy, CopyCheck } from 'lucide-react';
import { useParams } from 'next/navigation';

export const useVendorsTransactionTableColumns = () => {
  const { id } = useParams();
  const projectId = id as string;
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { clickToCopy, copyAction } = useCopy();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row.original?.transactionType}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => (
        <div className="flex flex-row">
          <div className="w-20 truncate">
            <a
              href={`https://stellar.expert/explorer/${
                settings?.[projectId]?.[
                  PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS
                ]?.['network'] === 'mainnet'
                  ? 'public'
                  : 'testnet'
              }/tx/${row?.original?.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-blue-500 hover:underline cursor-pointer "
            >
              {row.getValue('txHash')}
            </a>
          </div>
          <button
            onClick={() =>
              clickToCopy(row.getValue('txHash'), row.getValue('txHash'))
            }
            className="ml-2 text-sm text-gray-500"
          >
            {copyAction === row.getValue('txHash') ? (
              <CopyCheck className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className="text-xs font-normal"
          style={{
            backgroundColor:
              row.original?.fspId === null ? '#ECFDF3' : '#ECFDF3', //#F2F4F7',
            color: row.original?.fspId === null ? '#027A48' : '#027A48', //#344054',
          }}
        >
          {row.original?.fspId === null ? 'Online' : 'Online'}
        </Badge>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div>
          {row?.original?.createdAt ? dateFormat(row?.original?.createdAt) : ''}
        </div>
      ),
    },
  ];
  return columns;
};
