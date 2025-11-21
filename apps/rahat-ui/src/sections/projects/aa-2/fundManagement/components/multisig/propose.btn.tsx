import { useCreateAASafeTransaction } from '@rahat-ui/query';
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
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';

type Props = {
  projectUUID: UUID;
  tokenBalance: string;
};

export default function MultisigProposeBtn({
  projectUUID,
  tokenBalance,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number | ''>('');
  const createSafeTransaction = useCreateAASafeTransaction();

  const handleOpenChange = () => {
    setOpen(!open);
    setAmount('');
  };

  const handlePropose = async () => {
    if (Number(amount) > Number(tokenBalance)) {
      toast.warn('Proposed amount exceeds available token balance.');
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
        <Button className="rounded-xl">Propose Amount</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Propose an Amount</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              setAmount(val === '' ? '' : Number(val));
            }}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handlePropose}
            disabled={!amount || createSafeTransaction?.isPending}
            className="w-full"
          >
            {createSafeTransaction?.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Propose'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
