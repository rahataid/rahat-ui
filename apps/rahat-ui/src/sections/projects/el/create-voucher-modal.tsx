import React, { useState } from 'react';
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
import CreateToken from './create-token-modal';

const CreateVoucherModal = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [noOfVouchers, setNoOfVouchers] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
  };

  const handleInputChange = (e) => {
    setNoOfVouchers(e.target.value);
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
            <DialogTitle>Create Voucher</DialogTitle>
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
                  id="noOfVouchers"
                  className="col-span-3"
                  value={noOfVouchers}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-right">
                  Amount in $
                </Label>
                <Input id="amount" className="col-span-3" />
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
          </form>
        </DialogContent>
      </Dialog>

      <CreateToken open={showSuccessModal} noOfVouchers={noOfVouchers} />
    </>
  );
};

export default CreateVoucherModal;
