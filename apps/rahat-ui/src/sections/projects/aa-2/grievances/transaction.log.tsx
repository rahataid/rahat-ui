'use client';
import React from 'react';

import { ArrowRightLeft, Copy, CopyCheck } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult } from 'apps/rahat-ui/src/common';
type TransactionProps = {
  id: number;
  type: string;
  address: string;
  amount: string;
  date: string;
};

const transactions: TransactionProps[] = [];

const TransactionLogs = () => {
  const { clickToCopy, copyAction } = useCopy();
  return (
    <>
      <h2 className="text-xl font-semibold">Transaction Log</h2>
      <p className="text-sm text-muted-foreground">
        List of all token transactions
      </p>
      <ScrollArea className="h-[calc(100vh-500px)] mt-4">
        {transactions.length > 0 ? (
          transactions?.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between border-b last:border-b-0 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-full">
                  <ArrowRightLeft className="text-grey-600 w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {txn.type}
                  </p>
                  <div className="flex items-center">
                    <p className="text-xs text-muted-foreground truncate w-48 overflow-hidden">
                      {txn.address}
                    </p>
                    <button
                      onClick={() => clickToCopy(txn.address, txn.id)}
                      className="ml-2 text-sm text-gray-500"
                    >
                      {copyAction === txn.id ? (
                        <CopyCheck className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{txn.date}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-green-600">
                {txn.amount}
              </p>
            </div>
          ))
        ) : (
          <NoResult />
        )}
      </ScrollArea>
    </>
  );
};

export default TransactionLogs;
