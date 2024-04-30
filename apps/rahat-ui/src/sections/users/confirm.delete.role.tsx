import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

type Iprops = {
  open: boolean;
  handleSubmit: (e: any) => void;
  handleClose: () => void;
  data: any;
};

const DeleteConfirmModal = ({
  open,
  handleClose,
  handleSubmit,
  data,
}: Iprops) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
        </DialogHeader>
        <div>Do you want to delete the role ?</div>
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={() => {
              handleSubmit(data);
              handleClose();
            }}
            variant="secondary"
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            variant="outline"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
