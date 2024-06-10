import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useQuery } from 'urql';
import {
  TransactionDetails,
  ReceivedTransactionDetails,
} from '@rahat-ui/query';
import { Transaction, TransactionsObject } from './types';
import { useEffect, useState } from 'react';
import { mergeTransactions } from './utils';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { formatEther } from 'viem';

export default function RecentTransaction() {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  const [result] = useQuery({
    query: ReceivedTransactionDetails,
  });

  useEffect(() => {
    (async () => {
      result.data
        ? setTransactionList(result.data.tokenReceiveds)
        : setTransactionList([]);
    })();
  }, [result.data]);

  return (
    <Card className="rounded mr-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {transactionList.map((transaction) => (
          <div className="flex items-center gap-4" key={transaction.id}>
            <Avatar
              className={`h-9 w-9 sm:flex ${
                transaction.__typename === 'TokenReceived'
                  ? 'bg-green-200'
                  : 'bg-red-200'
              } flex items-center justify-center`}
            >
              {transaction.__typename === 'TokenReceived' ? (
                <ArrowUp size={20} strokeWidth={1.25} />
              ) : (
                <ArrowDown size={20} strokeWidth={1.25} />
              )}
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {transaction.__typename === 'TokenReceived'
                  ? transaction.from
                  : transaction._beneficiary}
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
              {transaction.__typename === 'TokenReceived'
                ? `$${formatEther(BigInt(transaction.amount))}`
                : `$${formatEther(BigInt(transaction._amount))}`}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
