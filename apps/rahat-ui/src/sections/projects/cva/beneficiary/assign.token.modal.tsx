import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { BadgePlus, Blocks } from 'lucide-react';

export default function AssignTokenModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3 items-center cursor-pointer">
            <BadgePlus size={18} strokeWidth={1.5} />
            <p>Create Token</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label
              htmlFor="token"
              className="text-right text-muted-foreground mb-2"
            >
              No.of Token
            </Label>
            <Input id="token" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
