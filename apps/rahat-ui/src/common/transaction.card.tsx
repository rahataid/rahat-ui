import React from 'react';
import { ArrowLeftRight, Info } from 'lucide-react';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { Heading } from './page.heading';
import { ITransactions } from '../types/transactions';

interface IProps {
  cardTitle: string;
  cardDesc?: string;
  cardData: ITransactions[];
}

export function TransactionCard({
  cardData,
  cardTitle,
  cardDesc = '',
}: IProps) {
  return (
    <div className="border rounded-md p-4">
      <Heading
        title={cardTitle}
        titleStyle="text-sm/6 text-muted-foreground font-semibold"
        description={cardDesc}
      />
      <ScrollArea className="p-3 h-[calc(100vh-570px)]">
        {cardData?.length ? (
          <div className="flex flex-col space-y-2">
            {cardData.map((i) => (
              <div
                key={i.title}
                className="flex justify-between space-x-4 items-center"
              >
                <div className="flex space-x-4 items-center">
                  <div className="p-4 rounded-full bg-muted">
                    <ArrowLeftRight />
                  </div>
                  <div>
                    <p className="text-sm/6 font-medium">{i.title}</p>
                    <p className="text-sm/4 text-gray-500">{i.subTitle}</p>
                    <p className="text-sm/4 text-muted-foreground">{i.date}</p>
                  </div>
                </div>
                <div>
                  <p className={`font-semibold text-lg text-${i.amtColor}-500`}>
                    {i.amount}
                  </p>
                </div>
              </div>
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
