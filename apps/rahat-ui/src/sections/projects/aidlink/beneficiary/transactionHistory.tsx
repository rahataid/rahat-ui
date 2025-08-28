import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

interface Transaction {
  date: string;
  amount: string;
}

const transactionData: Transaction[] = [
  { date: 'August 19, 2025, 1:38:14 PM', amount: '$1,000' },
  { date: 'August 19, 2025, 1:38:14 PM', amount: '$1,000' },
  { date: 'August 19, 2025, 1:38:14 PM', amount: '$1,000' },
  { date: 'August 19, 2025, 1:38:14 PM', amount: '$1,000' },
  { date: 'August 19, 2025, 1:38:14 PM', amount: '$1,000' },
  { date: 'August 19, 2025, 1:38:14 PM', amount: '$1,000' },
  { date: 'August 19, 2025, 1:38:14 PM', amount: '$1,000' },
];

function TransactionTable({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="flex-1 rounded-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-2 text-sm font-medium text-muted-foreground border-b">
            <div>Date</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="space-y-3">
            {transactionData.map((transaction, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-muted-foreground">{transaction.date}</div>
                <div className="text-right font-medium">
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionHistory() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <TransactionTable
        title="TRANSACTION HISTORY"
        description="List of all the transactions made"
      />
      <TransactionTable
        title="OFF-RAMPED HISTORY"
        description="List of all the off-ramps"
      />
    </div>
  );
}
