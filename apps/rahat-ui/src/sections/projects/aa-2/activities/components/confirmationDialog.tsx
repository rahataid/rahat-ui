import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type ConfirmationDialogProps = {
  isTemplateComfirmOpen: boolean;
  cancelTemplateToggle: () => void;
  confirmTemplateToggle: () => void;
};
const ConfirmationDialog = ({
  isTemplateComfirmOpen,
  cancelTemplateToggle,
  confirmTemplateToggle,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={isTemplateComfirmOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) cancelTemplateToggle();
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Confirm Template</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          Are you sure you want to save this activity as a template?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={cancelTemplateToggle}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={confirmTemplateToggle}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
