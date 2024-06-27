import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { TriangleAlert } from 'lucide-react';

interface WarningDialogProps {
  onConfirm: VoidFunction;
  open: boolean;
  onCancel: VoidFunction;
}

export function WarningDialog({
  onConfirm,
  open,
  onCancel,
}: WarningDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="items-center">
          <DialogTitle className="flex items-center justify-center h-10 w-10 rounded-full bg-red-200">
            <TriangleAlert className="text-red-600" />
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center justify-center text-red-600">
          <p>Disbursed amount cannot be drawn back.</p>
          <p>Are you sure you want to continue?</p>
        </div>
        <DialogFooter className="w-full">
          <DialogClose asChild>
            <Button
              className="bg-red-200 text-red-600 w-full hover:bg-red-300"
              onClick={onCancel}
              type="submit"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-full" onClick={onConfirm} type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
