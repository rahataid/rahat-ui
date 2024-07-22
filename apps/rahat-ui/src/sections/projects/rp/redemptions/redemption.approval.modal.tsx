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

type IProps = {
  handleSubmit: () => void;
};

export function RedemptionApprovalModal({handleSubmit}: IProps
) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-6 w-14 text-xs p-2">Approve</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Approve</DialogTitle>
          <DialogDescription>Approve redemptions.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
              Are you sure you want to approve this redemption?
          {/* <div className="grid grid-cols-4 items-center gap-4"> */}
            {/* <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div> */}
        </div>
        <DialogFooter>
          <Button  onClick={handleSubmit}>Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
