import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Entities, FundTransfer } from './cash.tracker';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { AlertCircle, ArrowRight, Check, Clock } from 'lucide-react';

function TransferList({
  transfers,
  entities,
}: {
  transfers: FundTransfer[];
  entities: Entities[];
}) {
  const id = useParams().id as UUID;

  return (
    <div className="divide-y">
      {transfers?.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No transfers initiated yet</p>
        </div>
      ) : (
        transfers?.map((transfer) => (
          <div
            key={transfer.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${
                  transfer.status === 'sent' || transfer.status === 'received'
                    ? 'bg-green-100 text-green-600'
                    : transfer.status === 'pending'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {transfer.status === 'sent' || 'received' ? (
                  <Check size={20} />
                ) : transfer.status === 'pending' ? (
                  <Clock size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transfer.from}</p>
                  <ArrowRight size={16} className="text-gray-400" />
                  <p className="font-medium">{transfer.to}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ${transfer.amount.toLocaleString()} •{' '}
                  {new Date(transfer.timestamp).toLocaleString()}
                </p>
                {transfer.comments && (
                  <p className="text-sm text-gray-600 mt-1">
                    {transfer.comments}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Badge
                variant={
                  transfer.status === 'sent' || transfer.status === 'received'
                    ? 'default'
                    : transfer.status === 'pending'
                    ? 'outline'
                    : 'destructive'
                }
                className={`text-xs font-medium ${
                  transfer.status === 'sent' || transfer.status === 'received'
                    ? 'bg-green-100 text-green-600'
                    : transfer.status === 'pending'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {transfer.status === 'sent' || transfer.status === 'received'
                  ? 'Confirmed'
                  : transfer.status === 'pending'
                  ? 'Pending'
                  : 'Blocked'}
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TransferList;
