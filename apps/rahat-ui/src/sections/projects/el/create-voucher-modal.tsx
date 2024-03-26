import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { PlusSquare } from 'lucide-react';
import { FC } from 'react';

interface CreateVoucherModalType {
  voucherInputs: {
    tokens: string;
    amountInDollar: string;
    amountInDollarReferral: string;
    description: string;
    descriptionReferred: string;
    currency: string;
  };
  handleSubmit: (e: any) => void;
  handleInputChange: (e: any) => void;
}

const CreateVoucherModal: FC<CreateVoucherModalType> = ({
  voucherInputs,
  handleSubmit,
  handleInputChange,
}) => {
  const handleSelectChange = (value: string) => {
    handleInputChange({
      target: {
        name: 'currency',
        value,
      },
    });
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <PlusSquare size={18} strokeWidth={1.5} />
              <p>Create Voucher</p>
            </div>
            <p className="text-sm">20</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Vouchers</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re done. */}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="noOfVouchers" className="text-right">
                  No. Of Free Vouchers
                </Label>
                <Input
                  name="tokens"
                  className="col-span-3"
                  value={voucherInputs.tokens}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="noOfVouchers" className="text-right">
                  No. Of Referred Vouchers
                </Label>
                <Input
                  name="tokens"
                  className="col-span-3"
                  value={+voucherInputs.tokens * 3}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="currency" className="">
                  Select Currency
                </Label>
                <Select name="currency" onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'NPR'}>NPR</SelectItem>
                      <SelectItem value={'USD'}>American Dollar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {voucherInputs.currency && (
                <>
                <div>
                  <Label htmlFor="amount" className="text-right">
                    Price of Free voucher in {voucherInputs.currency}
                  </Label>
                  <Input
                    name="amountInDollar"
                    className="col-span-3"
                    value={voucherInputs.amountInDollar}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="amount" className="text-right">
                    Price of Referred voucher in {voucherInputs.currency}
                  </Label>
                  <Input
                    name="amountInDollarReferral"
                    className="col-span-3"
                    value={voucherInputs.amountInDollarReferral}
                    onChange={handleInputChange}
                  />
                </div>
                </>
              )}
              <div>
                <Label htmlFor="description" className="text-right">
                  Description Free Voucher
                </Label>
                <Input
                  value={voucherInputs.description}
                  onChange={handleInputChange}
                  name="description"
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="descriptionReferred" className="text-right">
                  Description Referred Voucher
                </Label>
                <Input
                  value={voucherInputs.descriptionReferred}
                  onChange={handleInputChange}
                  name="descriptionReferred"
                  className="col-span-3"
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
    </>
  );
};

export default CreateVoucherModal;
