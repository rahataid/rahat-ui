import React from 'react';
import { ArrowLeftRight, Copy, CopyCheck } from 'lucide-react';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { Heading } from 'apps/rahat-ui/src/common';
import { format } from 'date-fns';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';

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

const Transaction = ({ amount, date, hash }: Txn) => {
  const { clickToCopy, copyAction } = useCopy();
  return (
    <div className="flex justify-between space-x-4 items-center">
      <div className="flex space-x-4 items-center">
        <div className="p-2 rounded-full bg-muted">
          <ArrowLeftRight size={16} />
        </div>
        <div>
          <div className="flex gap-1">
            <a
              target="_blank"
              href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
              className="cursor-pointer"
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
          <p className="text-sm text-muted-foreground">
            {date
              ? Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour12: true,
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(date))
              : 'N/A'}
          </p>
        </div>
      </div>
      <div>
        <p className="text-red-500 text-sm">{amount} </p>
      </div>
    </div>
  );
};

export default function TransactionCard({ transaction, loading }: Props) {
  return (
    <div className="border rounded-md p-4">
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
        <ScrollArea className=" h-[calc(200px)]">
          {transaction?.map((txn) => {
            return (
              <Transaction
                key={txn.hash}
                amount={txn.amount}
                date={txn.date}
                hash={txn.hash}
              />
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
}
