import { DialogDescription } from '@radix-ui/react-dialog';
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
  tokens: number;
  handleClose: () => void;
  handleSubmit: () => void;
};

const TokenAssingnConfirm = ({
  open,
  handleSubmit,
  handleClose,
  tokens,
}: Iprops) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Token Assign</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-muted-foreground">
          Are you sure you want to assign {tokens}{' '}
          {tokens > 1 ? 'tokens' : 'token'} to selected beneficiaries ?
        </DialogDescription>
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

export default TokenAssingnConfirm;
