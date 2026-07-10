import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { Copy, CopyCheck } from 'lucide-react';

type ValidateModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};
type ErrorData = {
  message: string;
  tokenAssignedBenfWallet: string[];
  foundAssignedBenf: string[];
  groupName: string;
};
type IProps = {
  validateModal: ValidateModalType;
  errorData: ErrorData | null;
};

const ErrorInfoPopupModel = ({ validateModal, errorData }: IProps) => {
  const { clickToCopy, copyAction } = useCopy();
  return (
    <Dialog open={validateModal.value} onOpenChange={validateModal.onToggle}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{errorData?.message}</DialogTitle>
          <DialogDescription>
            The following conflicts were found in group{' '}
            <span className="font-semibold">{errorData?.groupName}</span>.
            Please resolve them before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {errorData?.tokenAssignedBenfWallet && errorData.tokenAssignedBenfWallet.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-destructive uppercase tracking-wide">
                Already assigned — remove from group to continue
              </p>
              <ScrollArea className="max-h-40">
                <div className="space-y-1">
                  {errorData.tokenAssignedBenfWallet.map((wallet: string) => (
                    <div key={wallet} className="flex gap-1 items-center">
                      <p className="w-[300px] truncate text-sm">{wallet}</p>
                      <button
                        onClick={() => clickToCopy(wallet, wallet)}
                        className="ml-2 text-sm text-gray-500"
                      >
                        {copyAction === wallet ? (
                          <CopyCheck className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {errorData?.foundAssignedBenf && errorData.foundAssignedBenf.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                Assigned but disbursement still pending
              </p>
              <ScrollArea className="max-h-40">
                <div className="space-y-1">
                  {errorData.foundAssignedBenf.map((wallet: string) => (
                    <div key={wallet} className="flex gap-1 items-center">
                      <p className="w-[300px] truncate text-sm">{wallet}</p>
                      <button
                        onClick={() => clickToCopy(wallet, wallet)}
                        className="ml-2 text-sm text-gray-500"
                      >
                        {copyAction === wallet ? (
                          <CopyCheck className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorInfoPopupModel;
