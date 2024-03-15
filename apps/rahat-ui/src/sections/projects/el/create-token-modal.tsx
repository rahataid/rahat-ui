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
import { PlusSquare } from 'lucide-react';

const CreateVoucherModal = ({ open, noOfVouchers }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="noOfVouchers" className="text-right">
              No. Of Free Vouchers
            </Label>
            <Input
              disabled
              id="noOfVouchers"
              className="col-span-3"
              value={noOfVouchers}
            />
          </div>
          <div>
            <Label htmlFor="amount" className="text-right">
              No. Of Discount Vouchers
            </Label>
            <Input
              id="amount"
              className="col-span-3"
              value={noOfVouchers * 3}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoucherModal;
