import { useGraphQLErrorHandler } from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { FileWarning } from 'lucide-react';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type IDataType = {
  date: string;
  amount: number;
  status?: string;
};

interface ITransactionTablePrps {
  title: string;
  description: string;
  isLoading: boolean;
  error: any;
  data: IDataType[] | [];
  isDisplayStatus?: boolean;
}

export default function TransactionTable({
  title,
  description,
  isLoading,
  error,
  isDisplayStatus,
  data,
}: ITransactionTablePrps) {
  useGraphQLErrorHandler({
    error,
    customMessage:
      'Unable to load transaction history. Please verify wallet address and check your internet connection.',
  });

  return (
    <Card className="flex-1 rounded-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Loader />
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center gap-1 mt-5">
            <FileWarning className="text-gray-400" size={15} />
            <p className="text-gray-400 text-sm">
              No recent transactions found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`grid ${
                isDisplayStatus ? 'grid-cols-3' : 'grid-cols-2'
              }  gap-4 pb-2 text-sm font-medium text-muted-foreground border-b`}
            >
              <div>Date</div>
              {isDisplayStatus && <div className="text-center">Status</div>}
              <div className="text-right">Amount</div>
            </div>
            <div className="space-y-3">
              {data.map((transaction, index) => (
                <div
                  key={index}
                  className={`grid ${
                    isDisplayStatus ? 'grid-cols-3' : 'grid-cols-2'
                  } gap-4 text-sm`}
                >
                  <div className="text-muted-foreground">
                    {dateFormat(transaction.date)}
                  </div>
                  {isDisplayStatus && (
                    <div className="text-center">
                      <Badge
                        className={`bg-green-50 ${
                          transaction.status === 'SUCCESS'
                            ? 'text-green-600 border-green-500'
                            : 'text-yellow-600 border-yellow-500'
                        } text-xs`}
                      >
                        {transaction?.status}
                      </Badge>
                    </div>
                  )}
                  <div className="text-right font-medium">
                    {transaction.amount} USDC
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
