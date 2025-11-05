import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Entities, InKindTransfer } from './types';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { AlertCircle, ArrowRight, Check, Clock, Package } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

function InKindTransferList({
  transfers,
  entities,
  pendingTransfers = [],
  currentEntity,
  onConfirmReceipt,
}: {
  transfers: InKindTransfer[];
  entities: Entities[];
  pendingTransfers?: any[];
  currentEntity?: any;
  onConfirmReceipt?: (payload: any) => void;
}) {
  const id = useParams().id as UUID;
  const [confirmingTransferId, setConfirmingTransferId] = useState<
    string | null
  >(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<{
    transfer: InKindTransfer;
    pendingTransfer: any;
  } | null>(null);

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

  const handleOpenConfirm = (
    transfer: InKindTransfer,
    pendingTransfer: any,
  ) => {
    setSelectedTransfer({ transfer, pendingTransfer });
    setShowConfirmDialog(true);
  };

  const handleConfirmReceipt = async () => {
    if (!selectedTransfer || !onConfirmReceipt) return;
    setConfirmingTransferId(selectedTransfer.transfer.id);
    try {
      await onConfirmReceipt({
        from: currentEntity?.smartaccount || '',
        to: selectedTransfer.pendingTransfer.from,
        alias: selectedTransfer.pendingTransfer.to,
        amount: selectedTransfer.transfer.amount.toString(),
      });
      setShowConfirmDialog(false);
      setSelectedTransfer(null);
    } finally {
      setConfirmingTransferId(null);
    }
  };

  return (
    <>
      <div className="divide-y max-h-96 overflow-y-auto">
        {transfers?.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No distributions initiated yet</p>
          </div>
        ) : (
          transfers?.map((transfer) => {
            const isConfirmed =
              transfer.status === 'sent' || transfer.status === 'received';
            const isPending = transfer.status === 'pending';
            const isForCurrentUser = transfer.to === currentEntity?.alias;
            const canConfirm = isPending && isForCurrentUser;

            const pendingTransfer = pendingTransfers.find(
              (pt: any) =>
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
                          {transfer.amount.toLocaleString()}
                        </p>

                        {canConfirm &&
                          pendingTransfers?.length > 0 &&
                          onConfirmReceipt &&
                          pendingTransfer && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleOpenConfirm(transfer, pendingTransfer)
                              }
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              In-kind Receipt Confirmation
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-700 mt-2">
              Please confirm receipt of in-kind transfer
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-gray-100 rounded-lg px-6 py-4 w-full text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {selectedTransfer.transfer.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  Transfer Quantity
                </div>
              </div>
            </div>
          )}

          {selectedTransfer && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">From:</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTransfer.transfer.from}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">To:</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTransfer.transfer.to}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transfer Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(new Date(selectedTransfer.transfer.timestamp))}
                </span>
              </div>
              {selectedTransfer.transfer.comments && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remarks:</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                    {selectedTransfer.transfer.comments}
                  </span>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-row gap-2 sm:gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setShowConfirmDialog(false);
                setSelectedTransfer(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleConfirmReceipt}
              disabled={confirmingTransferId !== null}
            >
              <Check size={16} className="mr-2" />
              {confirmingTransferId ? 'Confirming...' : 'Confirm Receipt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InKindTransferList;
