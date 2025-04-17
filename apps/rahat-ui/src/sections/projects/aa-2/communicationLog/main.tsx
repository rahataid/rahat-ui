import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { LucideIcon } from 'lucide-react';
import CommsActivitiesTable from './table/comms.activities.table';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import React from 'react';
import {
  useActivities,
  useActivitiesStore,
  useCommsStats,
  usePagination,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function CommunicationMainLogsView() {
  const { id: ProjectId } = useParams();
  const { data: commsStatsData } = useCommsStats(ProjectId as UUID);

  console.log(commsStatsData);
  const commStats = [
    {
      componentType: 'DATACARD',
      title: 'SMS Recipients',
      value:
        commsStatsData?.stats?.recipientsByTransport.find(
          (r) => r.name === 'SMS',
        )?.totalRecipients || 0,
      icon: 'MessageSquare',
    },
    {
      componentType: 'DATACARD',
      title: 'IVR Recipients',
      value:
        commsStatsData?.stats?.recipientsByTransport.find(
          (r) => r.name === 'IVR',
        )?.totalRecipients || 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Total SMS sent to Beneficiaries',
      value: commsStatsData?.stats?.messageStats?.totalMessages || 0,
      icon: 'MessageSquare',
    },
    {
      componentType: 'DATACARD',
      title: 'Total IVR sent to Beneficiaries',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Total EMAIL sent to Beneficiaries',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'IVR Success Rate',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Average IVR Attempts',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Average Duration of IVR',
      value: 0,
      icon: 'AudioLines',
    },
  ];

  return (
    <div className="p-4">
      <Heading
        title="Communications Logs"
        description="Track all the communication logs here"
      />

      <div className="grid grid-cols-2 gap-2">
        {commStats
          ?.filter(
            (d) =>
              d?.title === 'IVR Recipients' || d?.title === 'SMS Recipients',
          )
          ?.map((d) => {
            const Icon = getIcon(d.icon);
            return (
              <Card key={d?.title} className="rounded-sm bg-card p-0 border ">
                <CardHeader className="pb-0 pt-3">
                  <CardTitle className="flex justify-between items-center pb-0">
                    <h1 className="text-base text-gray-600">{d.title}</h1>
                    <div className="p-1 rounded-full bg-secondary text-primary">
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-primary font-bold text-2xl pb-1">
                  {d.value}
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="grid grid-cols-6 gap-2 mt-2">
        {commStats
          ?.filter(
            (d) =>
              d?.title !== 'IVR Recipients' && d?.title !== 'SMS Recipients',
          )
          ?.map((d) => {
            if (d.componentType === 'DATACARD') {
              const Icon = getIcon(d.icon);
              return (
                <Card key={d?.title} className="rounded-sm bg-card p-0 border ">
                  <CardHeader className="pb-0 pt-3">
                    <CardTitle className="flex justify-between items-center">
                      <h1 className="text-xs text-gray-600">{d.title}</h1>
                      <div className="p-1 rounded-full bg-secondary text-primary">
                        <Icon size={16} strokeWidth={2.5} />
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-primary font-bold text-2xl pb-1">
                    {d.value}
                  </CardContent>
                </Card>
              );
            }
          })}
      </div>

      <div className=" mt-4">
        <CommsActivitiesTable />
      </div>
    </div>
  );
}
