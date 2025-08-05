import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { Heading } from 'apps/rahat-ui/src/common';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { formatEnumString } from 'apps/rahat-ui/src/utils/string';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { ArrowLeftRight, Copy, CopyCheck } from 'lucide-react';
import { useParams } from 'next/navigation';

type Txn = {
  title?: string;
  subtitle?: string;
  date?: string;
  amount?: string;
  hash?: string;
  beneficiaryName?: string;
};
type Props = {
  loading: boolean;
  transaction: Txn[];
};

const Transaction = ({ amount, date, hash, title }: Txn) => {
  const { id } = useParams();
  const projectId = id as string;
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { clickToCopy, copyAction } = useCopy();
  return (
    <div className="flex justify-between space-x-4 items-center">
      <div className="flex space-x-4 items-center">
        <div className="p-2 rounded-full bg-muted">
          <ArrowLeftRight size={22} />
        </div>
        <div>
          <div>
            <p className="font-normal text-[14px] leading-[16px] text-[#37404C]">
              {title ? formatEnumString(title) : 'N/A'}
            </p>
          </div>
          <div className="flex gap-1">
            <a
              target="_blank"
              href={`https://stellar.expert/explorer/${
                settings?.[projectId]?.[
                  PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS
                ]?.['network'] === 'mainnet'
                  ? 'public'
                  : 'testnet'
              }/tx/${hash}`}
              className="cursor-pointer text-[14px] font-normal text-[#297AD6] leading-[16px]"
            >
              <p className="text-sm font-medium truncate w-24">{hash}</p>
            </a>
            <span
              onClick={() => clickToCopy(hash || '', 1)}
              className="cursor-pointer"
            >
              {copyAction === 1 ? <CopyCheck size={16} /> : <Copy size={16} />}
            </span>
          </div>
          <p className="text-[14px] font-normal text-[#64748B] leading-[16px]">
            {date
              ? Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour12: true,
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                }).format(new Date(date))
              : 'N/A'}
          </p>
        </div>
      </div>
      <div>
        <p className="font-semibold text-[14px] leading-[24px]">
          {amount}{' '}
          {
            settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]
              ?.assetcode
          }
        </p>
      </div>
    </div>
  );
};

export default function TransactionCard({ transaction, loading }: Props) {
  return (
    <div className="border rounded-sm p-4">
      <Heading
        title="Recent Transactions"
        titleStyle="text-lg"
        description="List of recently made transactions"
      />
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between space-x-4 items-center"
            >
              <div className="flex space-x-4 items-center">
                <Skeleton className="h-12 w-12 rounded-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" /> {/* Title */}
                  <Skeleton className="h-3 w-32" /> {/* Subtitle */}
                  <Skeleton className="h-3 w-20" /> {/* Date */}
                </div>
              </div>

              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <ScrollArea className=" h-[calc(350px)]">
          {transaction?.map((txn) => {
            return (
              <div className="mb-4">
                <Transaction
                  key={txn.hash}
                  amount={txn.amount}
                  date={txn.date}
                  hash={txn.hash}
                  title={txn.title}
                />
              </div>
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
}
