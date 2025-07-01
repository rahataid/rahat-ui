import { Avatar } from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
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
    <Card className="rounded mr-2">
      <CardHeader>
        <CardTitle>Recent Deposits</CardTitle>
      </CardHeader>
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
                {`${formatEther(BigInt(transaction.value))}`}
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
