'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useState } from 'react';
import { PaymentState } from './payment';

export type PaymentDialogProps = {
  handleSubmit: () => void;
  formState: PaymentState;
  handleDialogOpen: () => Promise<boolean>;
};
export function PaymentDialog({
  formState,
  handleSubmit,
  handleDialogOpen,
}: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  // console.log(formState?.group?.groupedBeneficiaries.length === 0);

  // Handlers goes here
  const handleDialogBox = async () => {
    const isValid = await handleDialogOpen();

    console.debug('isValid', isValid);

    if (!isValid) {
      return;
    }

    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <Button
        className="rounded-sm w-48"
        type="button"
        onClick={handleDialogBox}
      >
        Confirm
      </Button>
      <DialogContent
        className="!rounded-sm"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="!text-center">
          <DialogTitle>Confirm Payout</DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm this payout?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 p-6 rounded-sm bg-gray-200 border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">Payout Type</div>
            <div className="font-medium text-muted-foreground">
              {formState?.method}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">Payout Method</div>
            <div className="font-medium text-muted-foreground">
              {formState?.method === 'FSP'
                ? formState?.paymentProvider?.name
                : formState.mode.charAt(0).toUpperCase() +
                  formState.mode.slice(1).toLowerCase()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">
              Beneficiary Group Name
            </div>
            <div className="font-medium text-muted-foreground">
              {formState?.group?.name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">Total Beneficiaries</div>
            <div className="font-medium text-muted-foreground">
              {formState?.group?.groupedBeneficiaries?.length}
            </div>
          </div>

          {Object.keys(formState.vendor).length !== 0 && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600 font-medium">Vendor Name</div>
                <div className="font-medium text-muted-foreground">
                  {formState?.vendor?.name}
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">Tokens</div>
            <div className="font-medium text-muted-foreground">
              {formState?.group?.tokensReserved?.numberOfTokens}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-sm"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-sm"
          >
            Payout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
