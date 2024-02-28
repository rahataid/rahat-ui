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
          <div className="mt-5 ml-auto">
            <Select onValueChange={(e) => handleChange(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trigger">Trigger</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-8">
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
