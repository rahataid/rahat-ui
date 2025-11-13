import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

import { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useTriggerCommunication } from '@rahat-ui/community-query';

type IProps = {
  campaignId: string;
  uuid: string;
};
export function TriggerConfirmModal({ campaignId, uuid }: IProps) {
  const [open, setOpen] = useState(false);
  const triggerCampaign = useTriggerCommunication(uuid);

  const handleTriggerCampaign = () => {
    triggerCampaign.mutateAsync(campaignId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 w-36 h-9">Trigger</Button>
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
