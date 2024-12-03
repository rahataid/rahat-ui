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
import { ReactNode } from 'react';

type IProps = {
  title: string;
  subtitle: string;
  trigger: ReactNode;
  onCancel: VoidFunction;
  onSubmit: VoidFunction;
};

export function DialogComponent({
  title,
  subtitle,
  trigger,
  onCancel,
  onSubmit,
}: IProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex justify-center text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="flex justify-center text-base">
            {subtitle}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            className="w-full"
            variant="secondary"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button className="w-full" type="submit" onClick={onSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
