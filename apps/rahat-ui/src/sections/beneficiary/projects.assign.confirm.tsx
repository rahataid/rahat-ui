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

const ProjectConfirm = ({ open, handleSubmit, handleClose }: Iprops) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Project</DialogTitle>
        </DialogHeader>
        <DialogContent>Are you sure ?</DialogContent>
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
  );
};

export default ProjectConfirm;
