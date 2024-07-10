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
  isSubmitting?: boolean;
};

const CampaignModal = ({
  open,
  handleSubmit,
  handleClose,
  isSubmitting,
}: Iprops) => {
  return (
    <div className="py-2 w-full border-t">
      <div className="p-4 flex flex-col gap-0.5 text-sm">
        <Dialog open={open}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Project</DialogTitle>
            </DialogHeader>
            {/* <DialogContent>Are you sure ?</DialogContent> */}
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
                disabled={isSubmitting}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CampaignModal;
