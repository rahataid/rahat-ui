'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { BarChart2, Cloud } from 'lucide-react';
import React from 'react';

interface IProps {
  data: any;
}
export default function WeatherDashboard({ data }: IProps) {
  console.log(data?.[0].data?.extremeWeatherOutlook);
  const sanitizedData = React.useMemo(() => {
    return [
      {
        label: 'Extreme Weather Outlook',
        subLabel:
          'Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed',
        value: data?.[0].data?.extremeWeatherOutlook,
      },
      {
        label: 'Deterministics Prediction System',
        subLabel:
          'Predicts commulative rainfall more than 300 MM in next 3 to 5 Days',
        value: data?.[0].data?.deterministicsPredictionSystem,
      },
      {
        label: 'Probabilistic Prediction System',
        subLabel:
          'Heavy Rainfall 115 MM per day 80 percent probablity in next 3 to 5 days',
        value: data?.[0].data?.probabilisticPredictionSystem,
      },
    ];
  }, [data]);
  return (
    <div className="w-full p-6 bg-white border rounded-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sanitizedData?.map((d: any) => (
          <Card className="border-none shadow-none" key={d.label}>
            <CardHeader className="pb-2 flex flex-row gap-2 items-center">
              <div className="">
                <BarChart2 className="h-6 w-6 text-slate-500" />
              </div>
              <div className="flex  flex-col gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base font-semibold">
                    {d.label}
                  </CardTitle>
                  <p className="text-sm text-slate-700 mt-1 break-words">
                    {d.subLabel}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4  ">
              <div className="text-md font-normal break-words">{d.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
