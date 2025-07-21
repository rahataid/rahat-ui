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

interface IProps {
  cardTitle: string;
  cardDesc?: string;
  cardData: any;
  loading?: boolean;
}

export function TransactionCard({
  cardData,
  cardTitle,
  cardDesc = '',
  loading = false,
}: IProps) {
  return (
    <div className=" rounded-md p-4">
      <Heading
        title={cardTitle}
        titleStyle="text-sm/6 text-muted-foreground font-semibold"
        description={cardDesc}
      />
      <ScrollArea className=" h-[calc(80vh-200px)] scrollbar-hidden">
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
            {cardData.map((i) => (
              <a
                key={i.title}
                href={`https://stellar.expert/explorer/testnet/tx/${i.hash}`}
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
                      </p>

                      <Badge
                        className={`inline-flex w-auto items-center px-2 py-0.5 rounded-sm text-xs font-medium ${
                          i.status === 'DISBURSED'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {i.status === 'DISBURSED' ? 'Disbursed' : 'Failed'}
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
                      i.status === 'DISBURSED'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {i.numberOfTokens}
                  </p>
                </div>
              </a>
            ))}
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
