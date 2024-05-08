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
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';

export default function Modal1() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Disburse Token</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Disburse USDC To Beneficiary
          </DialogTitle>
          <DialogDescription>
            How would you like to disburse the fund ?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Project Balance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Your Wallet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Multisig Wallet A/C</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="submit">Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
