'use client';

import VoiceDetailTable from './voiceDetailTable';
import VoiceInfoCard from '../infoCard';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import LogCard from '../logCard';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  useGetCampaignQuery,
  useTriggerCampaignMutation,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { COMMUNICATION_DELIVERY_STATUS } from '@rahat-ui/types';
import {
  Select,
  SelectContent,
  SelectItem,
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
import { toast } from 'react-toastify';

export default function VoiceDetailView() {
  const triggerCampaign = useTriggerCampaignMutation();

  const params = useParams<{ tag: string; id: string }>();
  const { data, isLoading } = useGetCampaignQuery({
    id: Number(params.id),
  });

  const successIVR = data?.communicationLogs?.filter(
    (log) => log.status === COMMUNICATION_DELIVERY_STATUS.COMPLETED
  );

  const failedIVR = data?.communicationLogs?.filter(
    (log) => log.status === COMMUNICATION_DELIVERY_STATUS.FAILED
  );
  const logCardData = [
    { total: data?.communicationLogs?.length, title: 'Total IVR sent' },
    { total: successIVR?.length || 0, title: 'Successfull IVR' },
    { total: failedIVR?.length || 0, title: 'Failed IVR' },
  ];

  const handleChange = (e: string) => {
    if (e === 'trigger') {
      triggerCampaign
        .mutateAsync(Number(params.id))
        .then(() => {
          toast.success('Campaign Trigger Success.');
        })
        .catch((e) => {
          toast.error('Failed to Trigger Campaign.');
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <div className="flex justify-between font-semibold text-lg items-center mt-2">
            <div>Campaign Name</div>

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
          </div>
          <div className="mt-2">
            <VoiceInfoCard
              name={data?.name}
              type={data?.type}
              startTime={
                data?.startTime && new Date(data?.startTime).toLocaleString()
              }
              status={data?.status}
              totalAudience={data?.audiences.length}
            />
          </div>
          <div className="mt-5">
            <Card>
              <ScrollArea className="h-custom1">
                <CardContent>
                  <div className="grid grid-cols-3 gap-5 mt-8">
                    {logCardData.map((item) => (
                      <LogCard title={item.title} total={item.total} />
                    ))}
                  </div>
                  <VoiceDetailTable data={data?.communicationLogs} />
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
