'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

import { useParams } from 'next/navigation';
import InfoCard from '../infoCard';
import TextDetailTable from './textDetailTable';

import { useGetCampaign } from '@rumsan/communication-query';
export default function TextDetailView() {
  const params = useParams<{ tag: string; id: string }>();
  const { data, isLoading,refetch } = useGetCampaign({
    id: Number(params.id),
  });

  return (
    <>
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <div className="p-2 bg-secondary">
          <div className="flex justify-between font-semibold text-lg items-center mt-2">
            <div>Campaign Name</div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <InfoCard
                name={data?.data?.name}
                startTime={
                  data?.data?.startTime &&
                  new Date(data?.data?.startTime).toLocaleString()
                }
                status={data?.data?.status}
                totalAudience={data?.data?.audiences.length}
                type={data?.data?.type}
                refetch={ refetch}
              />
            </div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Message</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {data?.data?.details?.body
                    ? data?.data?.details?.body
                    : data?.data?.details?.message}
                </p>
              </CardContent>
            </Card>
          </div>
          {/* <div className="mt-5">
            <Card>
              <CardContent> */}
          {/* <div className="grid grid-cols-3 gap-5 mt-8">
                  {logCardData.map((item) => (
                    <LogCard title={item.title} total={item?.total} />
                  ))}
                </div> */}
          <TextDetailTable
            data={data?.data?.communicationLogs}
            type={data?.data?.type || ''}
          />
          {/* </CardContent>
            </Card>
          </div> */}
        </div>
      )}
    </>
  );
}
