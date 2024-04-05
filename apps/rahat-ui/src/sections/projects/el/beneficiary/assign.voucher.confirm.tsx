import { DialogDescription } from '@radix-ui/react-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

type Iprops = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
};

const AssignVoucherConfirm = ({ open, handleSubmit, handleClose }: Iprops) => {
  return (
    <div className="py-2 w-full border-t">
      <div className="p-4 flex flex-col gap-0.5 text-sm">
        <Dialog open={open}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Voucher Assign</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to assign voucher ?
            </DialogDescription>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button onClick={handleClose} type="button" variant="ghost">
                  Close
                </Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                type="button"
                variant="ghost"
                className="text-primary"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssignVoucherConfirm;
