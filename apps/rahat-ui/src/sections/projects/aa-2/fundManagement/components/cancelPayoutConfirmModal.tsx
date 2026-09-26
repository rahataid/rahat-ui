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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useTranslations } from 'next-intl';
import { WalletList } from './errorInfoPopupModel';

type IProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  wallets: string[];
  confirmWord: string;
};

const CancelPayoutConfirmModal = ({
  open,
  onClose,
  onConfirm,
  wallets,
  confirmWord,
}: IProps) => {
  const t = useTranslations('AA_PROJECT');
  const { clickToCopy, copyAction } = useCopy();
  const [typed, setTyped] = useState('');

  const close = () => {
    setTyped('');
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
        <div className="space-y-2">
          <p className="text-sm">
            {t.rich('TYPE_TO_CONFIRM', {
              word: confirmWord,
              b: (chunks) => <span className="font-semibold">{chunks}</span>,
            })}
          </p>
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={confirmWord}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            {t('BACK')}
          </Button>
          <Button
            variant="destructive"
            disabled={typed.trim() !== confirmWord}
            onClick={() => {
              setTyped('');
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
