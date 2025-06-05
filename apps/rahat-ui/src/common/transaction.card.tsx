import React from 'react';
import { ArrowLeftRight, Info } from 'lucide-react';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { Heading } from './page.heading';
import { ITransactions } from '../types/transactions';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { format } from 'date-fns';

interface IProps {
  cardTitle: string;
  cardDesc?: string;
  cardData: ITransactions[];
  loading?: boolean;
}

export function TransactionCard({
  cardData,
  cardTitle,
  cardDesc = '',
  loading = false,
}: IProps) {
  return (
    <div className="border rounded-md p-4">
      <Heading
        title={cardTitle}
        titleStyle="text-sm/6 text-muted-foreground font-semibold"
        description={cardDesc}
      />
      <ScrollArea className="h-[calc(340px)] scrollbar-hidden">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
        ) : cardData?.length ? (
          <div className="px-3 pt-3 flex flex-col space-y-2">
            {cardData.map((i) => (
              <a
                key={i.title}
                href={`https://stellar.expert/explorer/testnet/tx/${i.hash}`}
                target="_blank"
                className="flex justify-between space-x-4 items-center group"
              >
                <div className="flex space-x-4 items-center">
                  <div className="p-4 rounded-full bg-muted">
                    <ArrowLeftRight />
                  </div>
                  <div>
                    <p className="text-sm/6 font-medium group-hover:underline group-hover:underline-offset-2">
                      {i.title}
                    </p>
                    <p className="text-sm/4 text-gray-500 group-hover:underline group-hover:underline-offset-2">
                      {i.subTitle}
                    </p>
                    <p className="text-sm/4 text-muted-foreground group-hover:underline group-hover:underline-offset-2">
                      {new Date(i.date)?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className={`font-semibold text-lg text-${i.amtColor}-500`}>
                    {i.amount}
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
