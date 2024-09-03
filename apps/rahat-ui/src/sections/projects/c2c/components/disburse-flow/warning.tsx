'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

export function WarningModal({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-lg">
        <DialogHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <DialogTitle className="text-xl font-semibold text-red-600 mt-4">
            Disbursed amount cannot be drawn back.
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-red-600 mt-2">
          Are you sure you want to continue?
        </p>
        <DialogFooter className="flex justify-between mt-4">
          <DialogClose asChild>
            <Button className="bg-red-100 text-red-600 w-full py-2 rounded-md">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            className="bg-blue-500 text-white w-full py-2 rounded-md ml-4"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
