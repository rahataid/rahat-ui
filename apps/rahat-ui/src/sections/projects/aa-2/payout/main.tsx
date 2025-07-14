'use client';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import RecentPayout from './component/recent.payout';
import {
  useFetchTokenStatsStellar,
  useFundAssignmentStore,
  usePayouts,
  usePayoutStats,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useMemo } from 'react';
import { AARoles, RoleAuth } from '@rahat-ui/auth';

export default function PayoutView() {
  const params = useParams();
  const projectID = params.id as UUID;
  const route = useRouter();
  const { data: payouts } = usePayouts(projectID, {
    page: 1,
    perPage: 999,
  });
  const { data: statsPayout, isLoading } = usePayoutStats(projectID);
  useFetchTokenStatsStellar({
    projectUUID: projectID,
  });

  const { stellarTokenStats } = useFundAssignmentStore((state) => ({
    stellarTokenStats: state.stellarTokenStats,
  }));

  const payoutStats = useMemo(() => {
    const getAmountByName = (name: string) =>
      stellarTokenStats.find((item: any) => item.name === name)?.amount ??
      'N/A';

    return [
      {
        label: 'Project Balance',
        value: getAmountByName('Disbursement Balance'),
      },
      {
        label: 'Tokens Distributed',
        value: getAmountByName('Disbursed Balance'),
      },
      {
        label: 'Tokens Disbursed',
        value: getAmountByName('Remaining Balance'),
      },
      {
        label: '1 Token Value',
        value: getAmountByName('Token Price'),
      },
    ];
  }, [stellarTokenStats]);

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Payout"
          description="Track all the payout reports here"
        />
        <div className="flex flex-end gap-2">
          <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
            <IconLabelBtn
              Icon={Plus}
              handleClick={() => {
                route.push(`/projects/aa/${projectID}/payout/initiate-payout`);
              }}
              name="Initiate Payment"
              variant="default"
            />
          </RoleAuth>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {payoutStats.map((stat) => {
          return (
            <DataCard
              key={stat.label}
              title={stat.label}
              number={stat.value as string}
              className="rounded-sm"
            />
          );
        })}
      </div>
      <div className="flex flex-wrap mt-4 gap-4">
        <div className="flex-1 border rounded-sm p-4">
          <h1 className="text-lg font-medium mb-4">Payout Type</h1>
          <div className="w-full aspect-square">
            <PieChart
              chart={{
                series: [
                  { label: 'FSP', value: statsPayout?.payoutTypes?.FSP || 0 },
                  {
                    label: 'CVA',
                    value: statsPayout?.payoutTypes?.VENDOR || 0,
                  },
                ],
                colors: ['#F4A462', '#2A9D90'],
              }}
              custom={true}
              projectAA={true}
              donutSize="80%"
              width="100%"
              height="100%"
              type="donut"
            />
          </div>
        </div>

        <div className="flex-1 border rounded-sm p-4">
          <h1 className="text-lg font-medium mb-4">Total Payout</h1>
          <div className="w-full aspect-square">
            <PieChart
              chart={{
                series: [
                  {
                    label: 'Completed',
                    value: statsPayout?.completionStatus?.COMPLETED || 0,
                  },
                  {
                    label: 'Not Completed',
                    value: statsPayout?.completionStatus?.NOT_COMPLETED || 0,
                  },
                ],
                colors: ['#2A9D90', '#F4A462'],
              }}
              custom={true}
              projectAA={true}
              donutSize="80%"
              width="100%"
              height="100%"
              type="donut"
            />
          </div>
        </div>

        <div className="flex-[2] border rounded-sm p-4">
          <RecentPayout payouts={payouts} />
        </div>
      </div>
    </div>
  );
}
