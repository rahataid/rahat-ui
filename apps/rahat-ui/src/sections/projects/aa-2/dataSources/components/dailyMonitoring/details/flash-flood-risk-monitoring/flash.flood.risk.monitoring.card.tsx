import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BarChart2 } from 'lucide-react';
import * as React from 'react';

type IProps = {
  data: any;
};

export default function FlashFloodRiskMonitoringCard({ data }: IProps) {
  const renderColor = React.useCallback((status: string) => {
    if (status === 'Low Risk') return 'bg-green-100 text-green-500';
    if (status === 'Medium Risk') return 'bg-yellow-100 text-yellow-500';
    else return 'bg-red-100 text-red-500';
  }, []);

  return (
    <div className="grid border rounded-sm">
      <div className="p-4 flex gap-2">
        <div className="flex gap-2 items-center mb-4">
          <div
            className={`p-2 rounded-full  ${
              data?.[0]?.data?.status === 'Low Risk'
                ? ' text-green-500'
                : data?.[0]?.data?.status === 'Medium Risk'
                ? ' text-yellow-500'
                : ' text-red-500'
            }`}
          >
            <BarChart2 size={20} />
          </div>
        </div>
        <div className="text-center">
          <h1 className="font-medium text-md ">Status</h1>
          {
            <Badge
              className={` text-xs w-auto${renderColor(
                data?.[0]?.data?.status,
              )}`}
            >
              {data?.[0]?.data?.status ?? 'N/A'}
            </Badge>
          }
        </div>
      </div>
    </div>
  );
}
