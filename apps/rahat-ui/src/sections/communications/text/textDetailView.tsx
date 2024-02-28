'use client';

import {
  useGetCampaignQuery,
  useTriggerCampaignMutation,
} from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import InfoCard from '../infoCard';
import LogCard from '../logCard';
import TextDetailTable from './textDetailTable';

export default function TextDetailView() {
  const triggerCampaign = useTriggerCampaignMutation();

  const params = useParams<{ tag: string; id: string }>();
  const { data, isLoading } = useGetCampaignQuery({
    id: Number(params.id),
  });
  const logCardData = [
    { total: data?.communicationLogs.length, title: 'Total SMS sent' },
    { total: 3, title: 'Banked Beneficiaries' },
    { total: 2, title: 'Unbanked Beneficiaries' },
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
          <div className="mt-8 grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <InfoCard
                name={data?.name}
                startTime={
                  data?.startTime &&
                  new Date(data?.startTime).toLocaleDateString()
                }
                status={data?.status}
                totalAudience={data?.audiences.length}
                type={data?.type}
              />
            </div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Message</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {data?.details?.body
                    ? data?.details?.body
                    : data?.details?.message}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-5">
            <Card>
              <CardContent>
                <div className="grid grid-cols-3 gap-5 mt-8">
                  {logCardData.map((item) => (
                    <LogCard title={item.title} total={item?.total} />
                  ))}
                </div>
                <TextDetailTable
                  data={data?.communicationLogs}
                  type={data?.type || ''}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
