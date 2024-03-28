'use client';

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
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import InfoCard from '../infoCard';
import LogCard from '../logCard';
import TextDetailTable from './textDetailTable';
import {
  ServiceContext,
  ServiceContextType,
} from 'apps/rahat-ui/src/providers/service.provider';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TAGS } from '@rumsan/react-query/utils/tags';

export default function TextDetailView() {
  const { communicationQuery } = React.useContext(
    ServiceContext,
  ) as ServiceContextType;
  const queryClient = useQueryClient();

  // const triggerCampaign = communicationQuery.useTriggerCampaign();

  const params = useParams<{ tag: string; id: string }>();
  const { data, isLoading } = communicationQuery.useGetCampaign({
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
