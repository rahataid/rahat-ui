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
import { useTriggerCampaign } from '@rumsan/communication-query';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function TriggerConfirmModal({ id }) {
  const [open, setOpen] = useState(false);
  const triggerCampaign = useTriggerCampaign();
  const handleTriggerCampaign = () => {
    triggerCampaign
      .mutateAsync(id)
      .then(() => {
        toast.success('Campaign Trigger Success');
        setOpen(false);
      })
      .catch(() => {
        {
          toast.success('Campaign Trigger Failed');
          setOpen(false);
        }
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 w-40">Trigger</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm !!!</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          Are you sure you want to send the message ?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={() => handleTriggerCampaign()}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}