'use client';
import React from 'react';

import { ArrowRightLeft, Copy, CopyCheck } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useBeneficiaryRedeemInfo } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
type TransactionProps = {
  id: number;
  txHash: string;
  transactionType: string;
  address: string;
  tokenAmount: number;
  date: string;
};

const TransactionLogs = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;

  const { data: transactions, isLoading } = useBeneficiaryRedeemInfo({
    projectUUID: projectId,
    beneficiaryUUID: beneficiaryId,
  });

  const { clickToCopy, copyAction } = useCopy();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full ">
        <SpinnerLoader />
      </div>
    );
  }
  return (
    <>
      <h2 className="text-xl font-semibold">Transaction Log</h2>
      <p className="text-sm text-muted-foreground">
        List of all token transactions
      </p>
      <ScrollArea className="h-[calc(100vh-500px)]">
        {transactions?.length > 0 ? (
          transactions?.map((txn: TransactionProps) => (
            <div
              key={txn?.txHash}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-full">
                  <ArrowRightLeft className="text-grey-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Amount Disbursed</p>
                  <p className="text-sm text-muted-foreground">
                    {txn?.transactionType?.split('_').join(' ')}
                  </p>
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground truncate w-48 overflow-hidden">
                      {txn?.txHash}
                    </p>
                    <button
                      onClick={() => clickToCopy(txn?.txHash, txn?.txHash)}
                      className="ml-2 text-sm text-gray-500"
                    >
                      {copyAction === txn?.txHash ? (
                        <CopyCheck className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{txn?.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-end font-semibold text-green-600">
                  +RS. {txn?.tokenAmount}
                </p>
                <p className="text-sm text-gray-400">
                  {dateFormat(txn?.date, 'dd MMMM, yyyy')}
                </p>
              </div>
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
