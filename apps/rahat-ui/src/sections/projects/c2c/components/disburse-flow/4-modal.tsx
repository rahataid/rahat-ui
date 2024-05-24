import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import Link from 'next/link';

export default function Modal4() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Disburse Token4</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary text-center">
            Disburse USDC To Beneficiary
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <p className="text-center">
            You have successfully assigned 100 USDC each to 4 Beneficiary.
          </p>
          <p className="text-center">Your remaining balance is 1600 USDC.</p>
          <Link
            className="text-center text-primary underline underline-offset-4 "
            href={'#'}
          >
            View Transaction
          </Link>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
