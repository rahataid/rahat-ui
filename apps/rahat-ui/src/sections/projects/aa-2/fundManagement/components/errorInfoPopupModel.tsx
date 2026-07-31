import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { Button } from '@rahat-ui/shadcn/components/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { Copy, CopyCheck, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ValidateModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};
type ErrorData = {
  isAssignable: boolean;
  message: string;
  tokenAssignedBenfWallet: string[];
  foundAssignedBenf: string[];
  fiatRedeemNotCompleted: string[];
  groupName?: string;
};
type IProps = {
  validateModal: ValidateModalType;
  errorData: ErrorData | null;
  onContinue?: () => void;
};

const WalletList = ({
  wallets,
  copyAction,
  clickToCopy,
}: {
  wallets: string[];
  copyAction: string | number | null;
  clickToCopy: (id: string, text: string) => void;
}) => (
  <ScrollArea className="max-h-40">
    <div className="space-y-1">
      {wallets.map((wallet) => (
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
);

const ErrorInfoPopupModel = ({ validateModal, errorData, onContinue }: IProps) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { clickToCopy, copyAction } = useCopy();

  const isWarningOnly = errorData?.isAssignable === true;

  return (
    <Dialog open={validateModal.value} onOpenChange={validateModal.onToggle}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {isWarningOnly ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TriangleAlert className="w-5 h-5 text-yellow-500" />
                {t('PAYOUT_NOT_YET_COMPLETED')}
              </DialogTitle>
              <DialogDescription>
                {t('FIAT_PAYOUT_STILL_IN_PROGRESS_CONFIRM')}
              </DialogDescription>
            </DialogHeader>
            <WalletList
              wallets={errorData?.fiatRedeemNotCompleted ?? []}
              copyAction={copyAction}
              clickToCopy={clickToCopy}
            />
            <DialogFooter>
              <Button variant="outline" onClick={validateModal.onFalse}>
                {tg('CANCEL')}
              </Button>
              <Button onClick={onContinue} disabled={!onContinue}>{t('CONTINUE_ANYWAY')}</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{errorData?.message}</DialogTitle>
              <DialogDescription>
                {t('CONFLICTS_FOUND', { groupName: errorData?.groupName ?? '' })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {errorData?.tokenAssignedBenfWallet && errorData.tokenAssignedBenfWallet.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-destructive uppercase tracking-wide">
                    {t('ALREADY_ASSIGNED')}
                  </p>
                  <WalletList
                    wallets={errorData.tokenAssignedBenfWallet}
                    copyAction={copyAction}
                    clickToCopy={clickToCopy}
                  />
                </div>
              )}
              {errorData?.foundAssignedBenf && errorData.foundAssignedBenf.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                    {t('ASSIGNED_BUT_DISBURSEMENT_PENDING')}
                  </p>
                  <WalletList
                    wallets={errorData.foundAssignedBenf}
                    copyAction={copyAction}
                    clickToCopy={clickToCopy}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ErrorInfoPopupModel;
