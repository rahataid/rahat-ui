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

export default function Modal5() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Disburse Token5</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary text-center">
            Disburse USDC To Beneficiary
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <p className="text-center">
            You have successfully sent request for disbursement of 400 USDC :
            100 USDC each to 4 Beneficiary to this <br /> Genosis A/C:
            <Link
              className="text-center text-primary underline underline-offset-4 "
              href={'#'}
            >
              x2312ad323r.
            </Link>
          </p>
          <p className="text-center">
            Please contact your Genosis A/C holder for the release of the token.
          </p>
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
