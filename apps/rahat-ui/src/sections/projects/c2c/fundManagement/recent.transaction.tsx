import { ReceivedTransactionDetails } from '@rahat-ui/query';
import { Avatar } from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { formatEther } from 'viem';
import { Transaction } from './types';
import { truncateEthAddress } from '@rumsan/sdk/utils';


export default function RecentTransaction({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  console.log({ contractAddress });

  // TODO: refactor and add to libraries
  const [result] = useQuery({
    query: ReceivedTransactionDetails,
    variables: {
      contractAddress,
    },
    pause: !contractAddress,
  });

  console.log({ result });
  console.log(result.data);

  useEffect(() => {
    (async () => {
      result.data
        ? setTransactionList(result.data.transfers)
        : setTransactionList([]);
    })();
  }, [result.data]);

  return (
    <Card className="rounded mr-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {transactionList &&
          transactionList.map((transaction) => (
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
