import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Copy, CopyCheck, FileWarning } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { useParams } from 'next/navigation';
import { TransactionsObject } from '../../c2c/beneficiary/types';
import {
  useProjectSettingsStore,
  PROJECT_SETTINGS_KEYS,
  TransactionDetails,
  useGraphQLErrorHandler,
  amountFormat,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { mergeTransactions } from '@rahat-ui/query/lib/c2c/utils';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { formatEther } from 'viem';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

const RecentTransaction = () => {
  const [transactionList, setTransactionList] = useState([]);
  const { clickToCopy, copyAction } = useCopy();
  // const [totalCount, setTotalCount] = useState(0);
  const uuid = useParams().id as UUID;

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  const contractAddress = contractSettings?.c2cproject?.address;

  const [{ data, fetching, error }] = useQuery({
    query: TransactionDetails,
    variables: {
      contractAddress,
    },
    pause: !contractAddress,
  });

  useGraphQLErrorHandler({
    error,
    customMessage:
      'Unable to load transaction history. Please verify your wallet address and check your internet connection.',
  });

  useEffect(() => {
    if (data && !error) {
      (async () => {
        try {
          const transactionsObject: TransactionsObject = data;
          const transactionLists = await mergeTransactions(transactionsObject);
          setTransactionList(transactionLists);
        } catch {
          setTransactionList([]);
        }
      })();
    }
  }, [data, error]);

  return (
    <Card className="p-2 rounded-xl">
      <p className="text-lg font-semibold">Recent Transactions</p>

      <div className="mt-2">
        <ScrollArea className="h-[450px]">
          {fetching ? (
            <Loader />
          ) : transactionList.length === 0 ? (
            <div className="flex justify-center items-center gap-1 mt-5">
              <FileWarning className="text-gray-400" size={15} />
              <p className="text-gray-400 text-sm">
                No recent transactions found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactionList?.map((tx: any) => {
                return (
                  <Card key={tx.id} className="p-2 rounded-xl">
                    {/* Amount */}
                    <div className="flex items-center justify-between">
                      <p className="text-lg ">
                        {amountFormat(formatEther(tx.amount.toString()))} USDC
                      </p>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>

                    {/* From / To */}
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <p>From:</p>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger
                              className="flex items-center gap-3 cursor-pointer"
                              onClick={() =>
                                clickToCopy(
                                  tx?._tokenAddress,
                                  tx?._tokenAddress,
                                )
                              }
                            >
                              <p className="text-sm text-gray-500">
                                {truncateEthAddress(tx?._tokenAddress)}
                              </p>
                              {copyAction === tx?._tokenAddress ? (
                                <CopyCheck size={15} strokeWidth={1.5} />
                              ) : (
                                <Copy
                                  className="text-slate-500"
                                  size={15}
                                  strokeWidth={1.5}
                                />
                              )}
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-secondary"
                              side="bottom"
                            >
                              <p className="text-xs font-medium">
                                {copyAction === tx?._tokenAddress
                                  ? 'copied'
                                  : 'click to copy'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-1">
                        <p>To:</p>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger
                              className="flex items-center gap-3 cursor-pointer"
                              onClick={() => clickToCopy(tx?._to, tx?._to)}
                            >
                              <p className="text-sm text-gray-500">
                                {truncateEthAddress(tx?._to)}
                              </p>
                              {copyAction === tx?._to ? (
                                <CopyCheck size={15} strokeWidth={1.5} />
                              ) : (
                                <Copy
                                  className="text-slate-500"
                                  size={15}
                                  strokeWidth={1.5}
                                />
                              )}
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-secondary"
                              side="bottom"
                            >
                              <p className="text-xs font-medium">
                                {copyAction === tx?._to
                                  ? 'copied'
                                  : 'click to copy'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-sm text-gray-500">
                      {dateFormat(tx.date)}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};

export default RecentTransaction;
