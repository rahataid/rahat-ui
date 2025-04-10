import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';

type IProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleStore: () => void;
  handleAddAnother: () => void;
  handleSave: VoidFunction;
  isSubmitting: boolean;
};

export default function ConfirmAddTrigger({
  open,
  setOpen,
  handleStore,
  handleAddAnother,
  handleSave,
  isSubmitting = false,
}: IProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger asChild> */}
      <Button disabled={isSubmitting} className="w-40" onClick={handleStore}>
        {isSubmitting ? 'Please wait ...' : 'Confirm'}
      </Button>
      {/* </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            1 trigger added
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Click save to confirm the action or add another trigger
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col space-y-2">
          <Button onClick={handleSave}>Save</Button>
          <IconLabelBtn
            variant="outline"
            className="flex flex-row-reverse gap-2"
            Icon={Plus}
            name="Add another trigger"
            handleClick={() => handleAddAnother()}
          />
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
