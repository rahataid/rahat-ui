// import { useTriggerRpCampaign } from '@rahat-ui/query';
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
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type IProps = {
  campaignId: number;
};
export function TriggerConfirmModal({ campaignId }: IProps) {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  // const triggerCampaign = useTriggerRpCampaign(id as UUID);
  const handleTriggerCampaign = () => {
    setOpen(false);
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
