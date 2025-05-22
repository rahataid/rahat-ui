import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

import { BarChart2, RadioTower } from 'lucide-react';

import * as React from 'react';

type IProps = {
  data: any;
};

export default function GaugereadingMonitoringCard({ data }: IProps) {
  const renderColor = React.useCallback((status: string) => {
    if (status === 'Low Risk') return 'bg-green-100 text-green-500';
    if (status === 'Medium Risk') return 'bg-yellow-100 text-yellow-500';
    else return 'bg-red-100 text-red-500';
  }, []);

  return (


    <div className="grid  border grid-cols-1 md:grid-cols-2 rounded-sm">

      <div className="p-4 flex gap-2">
        <div className="flex gap-2 items-center mb-4">
          <div className={`p-2 rounded-full  `}>
            <BarChart2 size={20} />
          </div>
        </div>

        <div className="">
          <h1 className="font-medium text-md text-wrap ">Gauge Reading (mm)</h1>
          <h1 className="text-sm">{data?.[0]?.data?.gaugeReading}</h1>
        </div>
      </div>{' '}
      <div className="p-4 flex gap-2">
        <div className="flex gap-2 items-center mb-4">
          <div className={`p-2 rounded-full  `}>
            <RadioTower size={20} />
          </div>
        </div>
        <div className="">
          <h1 className="font-medium text-md text-wrap ">Station</h1>
          <h1 className="text-sm">{data?.[0]?.data?.station}</h1>
        </div>

      </div>
    </div>
  );
}
