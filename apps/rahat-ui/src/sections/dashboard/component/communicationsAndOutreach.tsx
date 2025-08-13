import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import React from 'react';

const CommunicationsAndOutreach = () => {
  return (
    <div className="flex flex-col mt-4">
      <Heading
        title="Communications & Outreach"
        titleStyle="text-lg"
        description="Reach and effectiveness of communication channels"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
        <DataCard
          title="Total Communication Sent"
          className="rounded-sm"
          smallNumber="10"
        />
      </div>

      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[320px]">
          <h1 className="text-sm font-medium">Communication Channels Used</h1>
          <div className="flex-1 p-2">
            <BarChart
              series={[20, 50, 40, 80]}
              categories={['SMS', 'Voice', 'Email', 'IVR']}
              colors={['#4A90E2']}
              xaxisLabels={true}
              yaxisLabels={true}
              barHeight={20}
              height="100%"
              width="100%"
              xaxisTitle="Communication Channels Used"
              yaxisTitle="No. of messages/broadcasts"
              columnWidth={'20%'}
            />
          </div>
        </div>
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[320px]">
          <h1 className="text-sm font-medium">
            Communication Success and Failure Rate
          </h1>
          <div className="w-full flex-1 p-4 pt-0">
            <PieChart
              chart={{
                series: [
                  { label: 'Success', value: 10 },
                  {
                    label: 'Failure',
                    value: 20,
                  },
                ],
                colors: ['#388E3C', '#D32F2F'],
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
      </div>
    </div>
  );
};

export default CommunicationsAndOutreach;
