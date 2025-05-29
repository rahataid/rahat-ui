import { useTriggerRpCampaign } from '@rahat-ui/query';
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
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type IProps = {
  campaignId: string;
  completed: boolean;
};
export function TriggerConfirmModal({ campaignId, completed }: IProps) {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const triggerCampaign = useTriggerRpCampaign(id as UUID);
  const handleTriggerCampaign = () => {
    triggerCampaign.mutateAsync({ uuid: campaignId });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={completed}
          className="flex items-center gap-2 w-36 h-9"
        >
          {completed ? 'Triggered' : 'Trigger'}
        </Button>
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
