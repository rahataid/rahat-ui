'use client';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import RecentPayout from './component/recent.payout';

export default function PayoutView() {
  const { id: projectID } = useParams();
  const route = useRouter();
  const payoutStats = [
    {
      label: 'Project Balance',
      value: 23000,
    },
    {
      label: 'Tokens Distributed',
      value: 10000,
    },
    {
      label: 'Tokens Disbursed',
      value: 5000,
    },
    {
      label: '1 Token Value',
      value: 'Rs. 10',
    },
  ];

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Payout"
          description="Worem ipsum dolor sit amet, consectetur adipiscing elit"
        />
        <div className="flex flex-end gap-2">
          <IconLabelBtn
            Icon={Plus}
            handleClick={() => {
              route.push(`/projects/aa/${projectID}/payout/initiate-payout`);
            }}
            name="Initiate Payment"
            variant="default"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {payoutStats.map((stat) => {
          return (
            <DataCard
              key={stat.label}
              title={stat.label}
              number={stat.value as string}
              className="rounded-sm h-24"
            />
          );
        })}
      </div>
      <div className="flex mt-4 gap-4">
        <div className=" border rounded-sm p-4 h-[calc(50vh)]">
          <h1 className="text-lg font-medium">Token Status</h1>
          <PieChart
            chart={{
              series: [
                {
                  label: 'Project Balance',
                  value: 23000,
                },
                {
                  label: 'Tokens Distributed',
                  value: 10000,
                },
              ],
              colors: ['#F4A462', '#2A9D90'],
            }}
            custom={true}
            projectAA={true}
          />
        </div>
        <div className="flex-[2] border rounded-sm p-4">
          <RecentPayout />
        </div>
      </div>
    </div>
  );
}
