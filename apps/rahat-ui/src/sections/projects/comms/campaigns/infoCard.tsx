import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@rahat-ui/shadcn/components/dialog';


import React from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { TAGS } from '@rumsan/react-query/utils/tags';
import { useTriggerCampaign } from '@rumsan/communication-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useCommunicationQuery } from '@rumsan/communication-query/providers';


type IProps = {
  campaignId?: number;
  name?: string;
  type?: string;
  startTime?: string;
  status?: string;
  totalAudience?: number;
  closeSecondPanel: VoidFunction;
};

const InfoCard: React.FC<IProps> = ({
  campaignId,
  name,
  type,
  startTime,
  status,
  totalAudience,
  closeSecondPanel,
}) => {
  const { queryClient } = useCommunicationQuery();
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);

  const triggerCampaign = useTriggerCampaign();
  const handleChange = (e: string) => {
    setTrigger(true);
    if (e === 'trigger') {
      triggerCampaign
        .mutateAsync(Number(campaignId))
        .then(() => {
          toast.success('Campaign Trigger Success.');
          queryClient.invalidateQueries({
            queryKey: [TAGS.GET_ALL_CAMPAIGNS, { projectId: id }],
          });
          setOpen(false);
          setTrigger(false);

          closeSecondPanel();
        })

        .catch((e) => {
          toast.error('Failed to Trigger Campaign.');
          setOpen(false);
          setTrigger(false);
        });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{name}</CardTitle>
        {status !== 'COMPLETED' && (
          <Select>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="hover:bg-muted p-1 rounded text-sm text-left w-full">
                  Trigger Campaign
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Trigger Campaign</DialogTitle>
                    <DialogDescription>Are you sure?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-primary"
                      onClick={() => handleChange('trigger')}
                      disabled={trigger}
                    >
                      {trigger ? 'Triggering' : 'Trigger'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <p>{type}</p>
            <p className="text-sm font-light">Type</p>
          </div>
          <div>
            <p>{status}</p>
            <p className="text-sm font-light">Status</p>
          </div>
          <div>
            <p>{totalAudience}</p>
            <p className="text-sm font-light">Total Audiences</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
