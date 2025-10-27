import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Entities, FundTransfer } from './cash.tracker';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { AlertCircle, ArrowRight, Check, Clock } from 'lucide-react';
import { useState } from 'react';

function TransferList({
  transfers,
  entities,
  pendingTransfers = [],
  currentEntity,
  onConfirmReceipt,
}: {
  transfers: FundTransfer[];
  entities: Entities[];
  pendingTransfers?: any[];
  currentEntity?: any;
  onConfirmReceipt?: (payload: any) => void;
}) {
  const id = useParams().id as UUID;
  const [confirmingTransferId, setConfirmingTransferId] = useState<
    string | null
  >(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="divide-y max-h-96 overflow-y-auto">
      {transfers?.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No transfers initiated yet</p>
        </div>
      ) : (
        transfers?.map((transfer) => {
          const isPending = transfer.status === 'pending';
          const isConfirmed =
            transfer.status === 'sent' || transfer.status === 'received';
          const isForCurrentUser = transfer.to === currentEntity?.alias;
          const canConfirm = isPending && isForCurrentUser;
          const pendingTransfer = pendingTransfers.find(
            (pt) =>
              pt.timestamp === transfer.timestamp &&
              pt.amount === transfer.amount,
          );
          return (
            <div
              key={transfer.id}
              className={`p-4 ${isPending ? 'bg-amber-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${
                      isConfirmed
                        ? 'bg-green-100 text-green-600'
                        : isPending
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {isConfirmed ? (
                      <Check size={20} />
                    ) : isPending ? (
                      <Clock size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div className="flex w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {transfer.to}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${
                            isConfirmed
                              ? 'bg-green-100 text-green-600 border-green-200'
                              : isPending
                              ? 'bg-amber-100 text-amber-600 border-amber-200'
                              : 'bg-red-100 text-red-600 border-red-200'
                          }`}
                        >
                          {isConfirmed
                            ? 'CONFIRMED'
                            : isPending
                            ? 'PENDING'
                            : 'BLOCKED'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {transfer.comments}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(transfer.timestamp))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        Rs. {transfer.amount.toLocaleString()}
                      </p>

                      {canConfirm &&
                        pendingTransfers?.length > 0 &&
                        onConfirmReceipt && (
                          <Button
                            variant="outline"
                            onClick={async () => {
                              setConfirmingTransferId(transfer.id);
                              try {
                                await onConfirmReceipt({
                                  from: currentEntity?.smartaccount || '',
                                  to: pendingTransfer.from,
                                  alias: pendingTransfer.to,
                                  amount: transfer.amount.toString(),
                                });
                              } finally {
                                setConfirmingTransferId(null);
                              }
                            }}
                            disabled={confirmingTransferId === transfer.id}
                            className="text-blue-500 border-blue-500 hover:bg-blue-50"
                          >
                            <Check size={16} className="mr-2" />
                            {confirmingTransferId === transfer.id
                              ? 'Confirming...'
                              : 'Confirm Received'}
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default TransferList;
