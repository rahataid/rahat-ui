import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { FC } from 'react';

type CreateVoucherModalType = {
  open: boolean;
  voucherInputs: {
    tokens: string;
    amountInDollar: string;
  };
  handleSubmit: (e: any) => void;
};

const CreateVoucherModal: FC<CreateVoucherModalType> = ({
  open,
  voucherInputs,
  handleSubmit,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="noOfVouchers" className="text-right">
                No. Of Free Vouchers
              </Label>
              <Input
                disabled
                id="tokens"
                className="col-span-3"
                value={voucherInputs.tokens}
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-right">
                No. Of Discount Vouchers
              </Label>
              <Input
                id="amount"
                className="col-span-3"
                value={+voucherInputs.tokens * 3}
                disabled
                name="referredTokenDescription"
              />
            </div>
            <div>
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" className="col-span-3" />
          </div>
          <div>
            <Label htmlFor="amountInDollar" className="text-right">
              Price
            </Label>
            <Input id="amountInDollar" className="col-span-3" name="referredTokenPrice"/>
          </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoucherModal;
