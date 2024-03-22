import { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
    description: string; // Added description field
  };
  handleSubmit: (e: any) => void;
};

const CreateVoucherModal: FC<CreateVoucherModalType> = ({
  open,
  voucherInputs,
  handleSubmit,
}) => {
  const [description, setDescription] = useState<string>('');

  const [price, setPrice] = useState<string>('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit({ ...voucherInputs, description, price });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitForm}>
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
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                className="col-span-3"
                name="description"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
            <div>
              <Label htmlFor="amountInDollar" className="text-right">
                Price
              </Label>
              <Input
                id="amountInDollar"
                className="col-span-3"
                name="referredTokenPrice"
                value={price}
                onChange={handlePriceChange}
              />
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
