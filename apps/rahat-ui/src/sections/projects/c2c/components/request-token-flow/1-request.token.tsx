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
import { Blocks } from 'lucide-react';

export default function RequestTokenModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Blocks size={18} strokeWidth={1.5} />
            <p>Request Token</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request For Fund Release</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between mt-4 mb-2">
          <p>Current Project Balance</p>
          <p>100 USDC</p>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              defaultValue="jondoe@example.com"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
