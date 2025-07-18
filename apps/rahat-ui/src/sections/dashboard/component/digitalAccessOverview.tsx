import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

const DigitalAccessOverview = () => {
  return (
    <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Access to Mobile Phones</h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Yes', value: 75 },
                { label: 'No', value: 25 },
              ],
              colors: ['#00796B', '#CFD8DC'],
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
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Internet Access</h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Yes', value: 75 },
                { label: 'No', value: 25 },
              ],
              colors: ['#00796B', '#CFD8DC'],
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

      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Digital Wallet Use</h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Yes', value: 75 },
                { label: 'No', value: 25 },
              ],
              colors: ['#00796B', '#CFD8DC'],
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

      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Types of Phone</h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Smartphone', value: 65 },
                { label: 'Keypad', value: 25 },
                { label: 'Both', value: 10 },
              ],
              colors: ['#00796B', '#CFD8DC', '#4A90E2'],
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
  );
};

export default DigitalAccessOverview;
