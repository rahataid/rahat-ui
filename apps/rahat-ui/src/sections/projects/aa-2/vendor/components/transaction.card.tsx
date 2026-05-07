import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { getAssetCode } from 'apps/rahat-ui/src/utils/stellar';
import { formatEnumString } from 'apps/rahat-ui/src/utils/string';
import { UUID } from 'crypto';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { ArrowLeftRight, Copy, CopyCheck, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { InKindLog } from '../types';

type Txn = {
  title?: string;
  subtitle?: string;
  date?: string;
  amount?: string | number;
  hash?: string;
  beneficiaryName?: string;
  type?: 'fsp' | 'cva' | 'inkind';
};

type Props = {
  loading: boolean;
  transaction: Txn[];
  inkindTransactions: InKindLog[];
};

const Transaction = ({ amount, date, hash, title, type }: Txn) => {
  const { id } = useParams();
  const projectId = id as string;

  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { clickToCopy, copyAction } = useCopy();
  const txnUrl = getExplorerUrl({
    chainSettings:
      settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
    target: 'tx',
    value: hash,
  });
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
              href={txnUrl || '#'}
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
          {type === 'cva' || type === 'fsp'
            ? getAssetCode(settings, projectId)
            : ''}
          {/* {getAssetCode(settings, projectId)} */}
        </p>
      </div>
    </div>
  );
};

export default function TransactionCard({
  transaction,
  inkindTransactions,
  loading,
}: Props) {
  const [activeTab, setActiveTab] = useState('fsp');

  console.log('inkindTransactions in card', inkindTransactions);
  const fspTransactions =
    transaction?.filter((txn) => txn.title === 'TOKEN_TRANSFER') || [];
  const cvaTransactions =
    transaction?.filter((txn) => txn.title === 'VENDOR_REIMBURSEMENT') || [];
  // const inKindTransactions =
  //   transaction?.filter(
  //     (txn) =>
  //       txn.title !== 'TOKEN_TRANSFER' && txn.title !== 'VENDOR_REIMBURSEMENT',
  //   ) || [];
  // const inKindTransactions = inkindTransactions.length;

  const TabsTriggerStats = [
    { value: 'fsp', title: 'FSP', count: fspTransactions.length },
    { value: 'cva', title: 'CVA', count: cvaTransactions.length },
    { value: 'inkind', title: 'In-kind', count: inkindTransactions.length },
  ];

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
      ) : transaction?.length || inkindTransactions?.length ? (
        // <ScrollArea className=" h-[calc(350px)]">
        //   {transaction?.map((txn) => {
        //     return (
        //       <div className="mb-4" key={txn.hash}>
        //         <Transaction
        //           amount={txn.amount}
        //           date={txn.date}
        //           hash={txn.hash}
        //           title={txn.title}
        //         />
        //       </div>
        //     );
        //   })}
        // </ScrollArea>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border bg-secondary rounded w-full">
            {TabsTriggerStats.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full data-[state=active]:bg-white"
              >
                <span>{tab.title}</span>
                <span
                  className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full
                      ${
                        activeTab === tab.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                >
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[calc(100vh-500px)]">
            <TabsContent value="fsp" className="mt-2  p-2">
              {fspTransactions?.map((txn) => {
                return (
                  <div className="mb-4 " key={txn.hash}>
                    <Transaction
                      amount={txn.amount}
                      date={txn.date}
                      hash={txn.hash}
                      title={txn.title}
                      type={'fsp'}
                    />
                  </div>
                );
              })}
              {!fspTransactions.length && <NoResult />}
            </TabsContent>

            <TabsContent value="cva" className="mt-2  p-2">
              {cvaTransactions?.map((txn) => {
                return (
                  <div className="mb-4 " key={txn.hash}>
                    <Transaction
                      amount={txn.amount}
                      date={txn.date}
                      hash={txn.hash}
                      title={txn.title}
                      type={'cva'}
                    />
                  </div>
                );
              })}
              {!cvaTransactions.length && <NoResult />}
            </TabsContent>

            <TabsContent value="inkind" className="mt-2  p-2 ">
              {inkindTransactions?.map((txn) => {
                return (
                  <div className="mb-4 " key={txn.txHash}>
                    <Transaction
                      amount={txn.quantity}
                      date={txn.redeemedAt}
                      hash={txn.txHash}
                      title={txn.groupInkind.inkind.name}
                      type={'inkind'}
                    />
                  </div>
                );
              })}
              {!inkindTransactions.length && <NoResult />}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      ) : (
        <div className="h-full grid place-items-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <Info />
            <p className="text-sm">No transactions made</p>
          </div>
        </div>
      )}
    </div>
  );
}
