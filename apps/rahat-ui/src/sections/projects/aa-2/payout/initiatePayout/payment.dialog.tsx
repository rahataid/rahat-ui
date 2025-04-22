// import { Button } from "@/components/ui/button"
// import {
// Dialog,
// DialogContent,
// DialogDescription,
// DialogFooter,
// DialogHeader,
// DialogTitle,
// DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

export type PaymentDialogProps = {
  handleSubmit: () => void;
  formState: {
    method: 'FSP' | 'CVA';
    group: string;
    vendor: string;
  };
  token: string;
  totalBeneficiaries: number;
};
export function PaymentDialog({
  formState,
  handleSubmit,
  token,
  totalBeneficiaries,
}: PaymentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="rounded-sm"
          disabled={!formState.method || !formState.group}
        >
          Confirm
        </Button>
      </DialogTrigger>
      <DialogContent className="!rounded-sm">
        <DialogHeader>
          <DialogTitle>Confirm Payout</DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm this payout?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 p-6 bg-gray-50 border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">
              Beneficiary Group Name
            </div>
            <div className="font-medium">{formState?.group}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">Total Beneficiaries</div>
            <div className="font-medium">{totalBeneficiaries}</div>
          </div>
          {formState.vendor !== '' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600 font-medium">Vendor Name</div>
                <div className="font-medium">{'vendorName'}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600 font-medium">
                  Vendor Wallet ID
                </div>
                <div className="font-medium">{'vendorWalletId'}</div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">Tokens</div>
            <div className="font-medium">{token}</div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Payout
          </Button>
          <Button type="submit">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
