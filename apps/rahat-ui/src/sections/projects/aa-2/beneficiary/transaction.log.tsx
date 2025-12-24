'use client';
import React from 'react';

import { ArrowRightLeft, Copy, CopyCheck } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import {
  PROJECT_SETTINGS_KEYS,
  useBeneficiaryRedeemInfo,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
type TransactionProps = {
  uuid: string;
  txHash: string;
  transactionType: string;
  tokenAmount: number;
  createdAt: string;
  payoutType: string;
  mode: string;
  extras?: any;
  vendorName?: string;
  updatedAt: string;
};

const TransactionLogs = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;
  const project = useProjectStore((p) => p.singleProject);
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
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
          transactions?.map((txn: TransactionProps) => {
            const txnUrl = getExplorerUrl({
              chainSettings:
                settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
              target: 'tx',
              value: txn?.txHash,
            });
            return (
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
                    <div className="text-sm text-muted-foreground flex items-center gap-1 text-gray-500">
                      <p>
                        {txn?.payoutType === 'VENDOR' ? 'CVA' : txn?.payoutType}
                      </p>
                      {txn?.mode && <span>•</span>}
                      <p>
                        {txn?.payoutType === 'FSP'
                          ? txn?.extras?.paymentProviderName
                              .split('_')
                              .join(' ')
                          : txn?.mode}
                      </p>
                      {txn?.mode === 'OFFLINE' && txn?.vendorName && (
                        <>
                          <span>•</span>
                          <p>{txn?.vendorName}</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center">
                      <a
                        href={txnUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-blue-500 hover:underline cursor-pointer"
                      >
                        <p className="text-sm truncate w-48 overflow-hidden">
                          {txn?.txHash}
                        </p>
                      </a>
                      {/* <p className="text-sm text-muted-foreground truncate w-48 overflow-hidden">
                      {txn?.txHash}
                    </p> */}
                      <button
                        onClick={() => clickToCopy(txn?.txHash, txn?.uuid)}
                        className="ml-2 text-sm text-gray-500"
                      >
                        {copyAction === txn?.txHash ? (
                          <CopyCheck className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-end font-semibold text-green-600">
                    RS. {txn?.tokenAmount}
                  </p>
                  <p className="text-sm text-end text-gray-400">
                    {dateFormat(txn?.updatedAt, 'dd MMMM, yyyy')}
                  </p>
                  <p className="text-sm text-end text-gray-400">
                    {dateFormat(txn?.updatedAt, 'hh:mm:ss a')}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <NoResult />
        )}
      </ScrollArea>
    </>
  );
};

export default TransactionLogs;
