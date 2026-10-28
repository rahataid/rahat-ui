import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useTranslations } from 'next-intl';
import { WalletList } from './errorInfoPopupModel';

type IProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  wallets: string[];
};

const CancelPayoutConfirmModal = ({
  open,
  onClose,
  onConfirm,
  wallets,
}: IProps) => {
  const t = useTranslations('AA_PROJECT');
  const { clickToCopy, copyAction } = useCopy();
  const [acknowledged, setAcknowledged] = useState(false);

  const close = () => {
    setAcknowledged(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && close()}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('ARE_YOU_SURE')}</DialogTitle>
          <DialogDescription>{t('CANCEL_PAYOUT_WARNING')}</DialogDescription>
        </DialogHeader>
        <WalletList
          wallets={wallets}
          copyAction={copyAction}
          clickToCopy={clickToCopy}
        />
        <label className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 cursor-pointer">
          <Checkbox
            className="mt-0.5"
            checked={acknowledged}
            onCheckedChange={(v) => setAcknowledged(v === true)}
          />
          <span className="text-sm text-red-700">
            {t('CANCEL_PAYOUT_ACKNOWLEDGE')}
          </span>
        </label>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            {t('BACK')}
          </Button>
          <Button
            variant="destructive"
            disabled={!acknowledged}
            onClick={() => {
              setAcknowledged(false);
              onConfirm();
            }}
          >
            {t('CANCEL_PAYOUT')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelPayoutConfirmModal;
