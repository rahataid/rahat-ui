import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

type Iprops = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  isSubmitting?: boolean;
};

const CampaignModal = ({
  handleSubmit,
  isSubmitting,
}: Iprops) => {
  return (
        <Dialog>
        <DialogTrigger asChild>
            <Button variant={'default'}>
              Submit
            </Button>
        </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Campaign</DialogTitle>
            </DialogHeader>
            <DialogContent>Are you sure ?</DialogContent>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
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
  );
};

export default CampaignModal;
