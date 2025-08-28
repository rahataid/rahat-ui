import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { Copy, CopyCheck } from 'lucide-react';

type ValidateModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};
type ErrorData = {
  message: string;
  wallets: string[];
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
            {`Please remove beneficiaries with these wallet addresses from selected group (${(
              <span className="font-semibold">{errorData?.groupName}</span>
            )}) and try again.`}
          </DialogDescription>
        </DialogHeader>

        <div>
          {errorData?.wallets?.map((wallet: string) => {
            return (
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
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorInfoPopupModel;
