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

export default function ConfirmAddTrigger() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-40">Confirm</Button>
      </AlertDialogTrigger>
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
          <Button>Save</Button>
          <IconLabelBtn
            variant="outline"
            className="flex flex-row-reverse gap-2"
            Icon={Plus}
            name="Add another trigger"
            handleClick={() => {}}
          />
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
