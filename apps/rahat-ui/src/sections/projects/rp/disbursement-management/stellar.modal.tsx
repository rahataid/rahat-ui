import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { ReactNode } from 'react';

interface InputModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
  children?: ReactNode; // Accepts dynamic content like input fields
}

export function InputModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  children,
}: InputModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="items-center">
          <DialogTitle className="flex items-center justify-center h-10 w-10 rounded-full bg-red-200">
         {/* <TriangleAlert className="text-red-600" /> */}
          </DialogTitle>
          {title && <p className="text-center font-bold">{title}</p>}
        </DialogHeader>
        {description && (
          <div className="py-4 flex flex-col items-center justify-center text-red-600">
            <p>{description}</p>
          </div>
        )}
        <div className="py-4">{children}</div>
        <DialogFooter className="w-full">
          <DialogClose asChild>
            <Button
              className="bg-red-200 text-red-600 w-full hover:bg-red-300"
              onClick={onCancel}
              type="button"
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
