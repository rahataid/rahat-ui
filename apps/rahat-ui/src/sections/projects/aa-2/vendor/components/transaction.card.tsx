import React from 'react';
import { Heading } from 'packages/modules';
import { ArrowLeftRight } from 'lucide-react';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';

const Transaction = () => {
  return (
    <div className="flex justify-between space-x-4 items-center">
      <div className="flex space-x-4 items-center">
        <div className="p-4 rounded-full bg-muted">
          <ArrowLeftRight />
        </div>
        <div>
          <p className="text-sm font-medium">wallet address with copy icon</p>
          <p className="text-sm text-muted-foreground">
            21 july, 2024 . 3:00pm
          </p>
        </div>
      </div>
      <div>
        <p className="text-red-500 text-sm">-10 USDC </p>
      </div>
    </div>
  );
};

export default function TransactionCard() {
  return (
    <div className="border rounded-md p-4">
      <Heading
        title="Recent Transactions"
        titleSize="lg"
        description="List of recently made transactions"
      />
      <ScrollArea className="p-3 h-[calc(100vh-700px)]">
        <div className="flex flex-col space-y-2">
          <Transaction />
          <Transaction />
          <Transaction />
          <Transaction />
          <Transaction />
          <Transaction />
          <Transaction />
        </div>
      </ScrollArea>
    </div>
  );
}
