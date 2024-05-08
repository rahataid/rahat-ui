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

export default function Modal2() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Disburse Token2</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Disburse USDC To Beneficiary
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <h1>Project Balance</h1>
          <h1>20000 USDC</h1>
        </div>
        <div className="flex items-center justify-between">
          <div>
            Send Amount <span className="text-primary">(4 Beneficiaries)</span>
          </div>
          <div className="flex w-1/4 max-w-sm items-center space-x-2 gap-2">
            <Input placeholder="100" />
            USDC
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
