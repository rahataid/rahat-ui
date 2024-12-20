import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@rahat-ui/shadcn/components/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type IProps = {
  name: string;
};

export default function ConfirmDeleteDialog({ name }: IProps) {
  return (
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle>Delete {name}</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete this
          {name}.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="submit">Cancel</Button>
        <Button type="submit">Ok</Button>
      </DialogFooter>
    </DialogContent>
  );
}
