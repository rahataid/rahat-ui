import React from 'react';
import { ArrowLeftRight, Info } from 'lucide-react';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { Heading } from './page.heading';
import { ITransactions } from '../types/transactions';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { format } from 'date-fns';
import { dateFormat } from '../utils/dateFormate';
import { intlDateFormat, intlFormatDate } from '../utils';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useProjectStore } from '@rahat-ui/query';

interface IProps {
  cardTitle: string;
  cardDesc?: string;
  cardData: any;
  loading?: boolean;
  cardHeight?: string;
}

export function TransactionCard({
  cardData,
  cardTitle,
  cardDesc = '',
  loading = false,
  cardHeight = 'h-[calc(80vh-200px)]',
}: IProps) {
  const project = useProjectStore((p) => p.singleProject);

  return (
    <div className=" rounded-md p-4">
      <Heading
        title={cardTitle}
        titleStyle="text-sm/6 text-muted-foreground font-semibold"
        description={cardDesc}
      />
      <ScrollArea className={` ${cardHeight} scrollbar-hidden`}>
        {loading ? (
          <div className=" pt-3 flex flex-col space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 border-gray-100 "
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
        ) : cardData?.length ? (
          <div className=" pt-3 flex flex-col space-y-2">
            {cardData.map((i) => {
              // Generate transaction hash from info object if available
              const getTransactionHash = (info: any) => {
                if (!info || !info?.transactionHashes) return null;
                // Extract transaction hash from the info object
                const hashParts = [];
                for (let j = 0; j < 66; j++) {
                  if (info?.transactionHashes[j]) {
                    hashParts.push(info?.transactionHashes[j]);
                  } else {
                    hashParts.push(info[j]);
                  }
                }

                return hashParts.join('');
              };

              const transactionHash = getTransactionHash(i.info);

              const explorerUrl =
                i.chainInfo?.explorerUrl || project?.name == 'AA Unicef EVM'
                  ? `https://sepolia.basescan.org`
                  : 'https://stellar.expert/explorer/testnet';
              const txUrl = transactionHash
                ? `${explorerUrl}/tx/${transactionHash}`
                : `${explorerUrl}/tx/${i.hash || ''}`;

              // Determine transaction status
              const isSuccessful =
                i.status === 'DISBURSED' ||
                i.isDisbursed === true ||
                i.info?.txReceipt?.status === 'SUCCESS';

              return (
                <a
                  key={i.title}
                  href={txUrl}
                  target="_blank"
                  className="flex items-center justify-between px-4 py-3 border-gray-100 "
                >
                  <div className="flex space-x-4 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {i.title}
                          {i.chainInfo?.currency?.symbol && (
                            <span className="ml-1 text-xs text-gray-500 font-normal">
                              ({i.chainInfo.currency.symbol})
                            </span>
                          )}
                        </p>

                        <Badge
                          className={`inline-flex w-auto items-center px-2 py-0.5 rounded-sm text-xs font-medium ${
                            isSuccessful
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {isSuccessful ? 'Disbursed' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <p className="text-xs text-gray-500">{i.group?.name}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          {intlDateFormat(i.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-lg ${
                        isSuccessful ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {i.numberOfTokens}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="h-32 grid place-items-center">
            <div className="flex flex-col items-center text-muted-foreground">
              <Info />
              <p className="text-sm">No transactions made</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
