import { Avatar } from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { ArrowUp } from 'lucide-react';
import { formatEther } from 'viem';
import { Transaction } from './types';

export default function RecentTransaction({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="mb-2 mr-2">
      <Card className="rounded h-full">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <ScrollArea className="h-auto">
          <CardContent className="grid gap-8">
            {transactions &&
              transactions.map((transaction) => (
                <div className="flex items-center gap-4" key={transaction.id}>
                  <Avatar
                    className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                  >
                    <ArrowUp size={20} strokeWidth={1.25} />
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {truncateEthAddress(transaction.from)}
                    </p>
                    <p>
                      <a
                        href={`https://sepolia.arbiscan.io/tx/${transaction.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {shortenTxHash(`${transaction.transactionHash}`)}
                      </a>
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {parseFloat(formatEther(BigInt(transaction.value))).toFixed(
                      4,
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
