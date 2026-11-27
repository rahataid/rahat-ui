import { useCreateAASafeTransaction } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { cn } from '@rahat-ui/shadcn/src';
import {
  ERROR_CLASSES,
  FILLED_CLASSES,
} from 'apps/rahat-ui/src/common/form-fields';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';

type Props = {
  projectUUID: UUID;
  tokenBalance: string;
  isTxPending: boolean;
};

export default function MultisigProposeBtn({
  projectUUID,
  tokenBalance,
  isTxPending,
}: Props) {
  const t = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const tAA = useTranslations('AA_PROJECT');
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number | ''>('');
  const createSafeTransaction = useCreateAASafeTransaction();
  const exceedsBalance = amount !== '' && amount > Number(tokenBalance);

  const handleOpenChange = () => {
    setOpen(!open);
    setAmount('');
  };

  const handlePropose = async () => {
    if (isTxPending) {
      toast.warn(t('PENDING_TRANSACTION_WARNING'));
      return;
    }
    if (Number(amount) > Number(tokenBalance)) {
      toast.warn(t('AMOUNT_EXCEEDS_BALANCE_WARNING'));
      return;
    }
    const result = await createSafeTransaction.mutateAsync({
      projectUUID,
      amount: String(amount),
    });
    setOpen(false);
    setAmount('');
    return result;
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        asChild
        disabled={
          !tokenBalance ||
          tokenBalance === '0' ||
          createSafeTransaction?.isPending
        }
      >
        <Button className="rounded-xl">{t('PROPOSE_AMOUNT')}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('PROPOSE_AN_AMOUNT')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label>
            {tAA('AMOUNT')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="number"
            placeholder={t('ENTER_AMOUNT')}
            value={amount}
            onChange={(e) => {
              const val = toAsciiDigits(e.target.value);
              setAmount(val === '' ? '' : Number(val));
            }}
            className={cn(
              amount !== '' && !exceedsBalance && FILLED_CLASSES,
              exceedsBalance && ERROR_CLASSES,
            )}
          />
          {exceedsBalance && (
            <p className="text-sm font-medium text-destructive">
              {t('AMOUNT_EXCEEDS_BALANCE_WARNING')}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handlePropose}
            disabled={
              !amount || exceedsBalance || createSafeTransaction?.isPending
            }
            className="w-full"
          >
            {createSafeTransaction?.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t('PROPOSE')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
