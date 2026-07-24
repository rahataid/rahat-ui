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
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

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
  const t = useTranslations('AA Project');
  const tg = useTranslations('AA Project with Gnosis');
  const [confirmingTransferId, setConfirmingTransferId] = useState<
    string | null
  >(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<{
    transfer: InKindTransfer;
    pendingTransfer: any;
  } | null>(null);
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();

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
            <p className="text-gray-500">{tg('NO_DISTRIBUTIONS_INITIATED_YET')}</p>
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
                              ? t('CONFIRMED')
                              : isPending
                              ? t('PENDING')
                              : t('BLOCKED')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {transfer.comments}
                        </p>
                        <p className="text-xs text-gray-500">
                           {formatDate(transfer.timestamp, 'dd MMMM, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatNum(transfer.amount)}
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
                                ? t('CONFIRMING')
                                : t('CONFIRM_RECEIVED')}
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
              {tg('IN_KIND_RECEIPT_CONFIRMATION')}
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-700 mt-2">
              {tg('PLEASE_CONFIRM_RECEIPT_OF_IN_KIND')}
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-gray-100 rounded-lg px-6 py-4 w-full text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {formatNum(selectedTransfer.transfer.amount)}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  {tg('TRANSFER_QUANTITY')}
                </div>
              </div>
            </div>
          )}

          {selectedTransfer && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('FROM')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTransfer.transfer.from}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('TO')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTransfer.transfer.to}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('TRANSFER_DATE')}</span>
                <span className="text-sm font-medium text-gray-900">
                   {formatDate(selectedTransfer.transfer.timestamp, 'dd MMMM, yyyy')}
                </span>
              </div>
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
              {t('CANCEL')}
            </Button>
            <Button
              type="button"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleConfirmReceipt}
              disabled={confirmingTransferId !== null}
            >
              <Check size={16} className="mr-2" />
              {confirmingTransferId ? t('CONFIRMING') : t('CONFIRM_RECEIPT')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InKindTransferList;
