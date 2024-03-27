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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  ServiceContext,
  ServiceContextType,
} from 'apps/rahat-ui/src/providers/service.provider';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TAGS } from '@rumsan/react-query/utils/tags';
import { toast } from 'react-toastify';

type IProps = {
  id?: number;
  name?: string;
  type?: string;
  startTime?: string;
  status?: string;
  totalAudience?: number;
};

const InfoCard: React.FC<IProps> = ({
  id,
  name,
  type,
  startTime,
  status,
  totalAudience,
}) => {
  const { communicationQuery } = React.useContext(
    ServiceContext,
  ) as ServiceContextType;
  const queryClient = useQueryClient();

  const triggerCampaign = communicationQuery.useTriggerCampaign();
  const handleChange = (e: string) => {
    if (e === 'trigger') {
      triggerCampaign
        .mutateAsync(Number(id))
        .then(() => {
          toast.success('Campaign Trigger Success.');
          queryClient.invalidateQueries([TAGS.GET_CAMPAIGNS]);
        })
        .catch((e) => {
          toast.error('Failed to Trigger Campaign.');
        });
    }
  };
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{name}</CardTitle>
        <Select>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <Dialog>
              <DialogTrigger className="hover:bg-muted p-1 rounded text-sm text-left w-full">
                Trigger Campaign
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Trigger Campaign</DialogTitle>
                  <DialogDescription>Are you sure??</DialogDescription>
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
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <p>{type}</p>
            <p className="text-sm font-light">Type</p>
          </div>
          <div>
            <p>{startTime}</p>
            <p className="text-sm font-light">Start Time</p>
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
