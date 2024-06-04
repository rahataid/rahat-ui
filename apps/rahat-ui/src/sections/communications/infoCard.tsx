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
  SelectItem,
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TAGS } from '@rumsan/react-query/utils/tags';
import { toast } from 'react-toastify';
import { useTriggerCampaign } from '@rumsan/communication-query';

type IProps = {
  id?: number;
  name?: string;
  type?: string;
  startTime?: string;
  status?: string;
  totalAudience?: number;
  // refetch : any
};

const InfoCard: React.FC<IProps> = ({
  id,
  name,
  type,
  startTime,
  status,
  totalAudience,
  // refetch
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const triggerCampaign = useTriggerCampaign();
  const handleChange = (e: string) => {
    if (e === 'trigger') {
      triggerCampaign
        .mutateAsync(Number(id))
        .then(() => {
          toast.success('Campaign Trigger Success.');
          queryClient.invalidateQueries([TAGS.GET_CAMPAIGNS]);
          setOpen(false);
          // refetch();
        })
        .catch((e) => {
          toast.error('Failed to Trigger Campaign.');
          setOpen(false);
        });
    }
  };
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{name}</CardTitle>
        {status !== 'COMPLETED' && (
          <Select value={''} onValueChange={() => setOpen(true)}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trigger-campaign">Trigger Campaign</SelectItem>
            </SelectContent>

            <Dialog open={open} onOpenChange={setOpen}>
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
                  >
                    Trigger
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <p>{type}</p>
            <p className="text-sm font-light">Type</p>
          </div>
          {/* <div>
            <p>{startTime}</p>
            <p className="text-sm font-light">Start Time</p>
          </div> */}
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
