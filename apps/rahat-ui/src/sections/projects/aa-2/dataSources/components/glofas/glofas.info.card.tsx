import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import {
  Calendar,
  TriangleAlert,
  ChartLine,
  ChartNoAxesColumn,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

type IProps = {
  glofas: Record<string, any>;
};

export default function GlofasInfoCard({ glofas }: IProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const updatedAt = glofas?.updatedAt;

  const [val2yr, val5yr, val20yr] =
    glofas?.info?.pointForecastData?.maxProbability?.data
      .split('/')
      .map((str: string) => str.trim());

  const cardData = React.useMemo(
    () => [
      {
        icon: Calendar,
        label: 'Forecast Date',
        value: glofas?.info?.forecastDate,
      },
      {
        icon: TriangleAlert,
        label: 'Alert Level',
        value: glofas?.info?.pointForecastData?.alertLevel?.data,
      },
      {
        icon: ChartNoAxesColumn,
        label: 'Discharge Tendency',
        value: glofas?.info?.pointForecastData?.dischargeTendencyImage?.data,
      },
      {
        icon: ChartLine,
        label: 'Peak Forecasted',
        value: glofas?.info?.pointForecastData?.peakForecasted?.data,
      },
    ],
    [glofas],
  );
  return (
    <div className="flex flex-col space-y-4">
      <div className="p-4 rounded-sm border shadow flex justify-between space-x-4">
        <div className="w-full">
          <div className="flex justify-between gap-4">
            <Heading
              title="Doda (Machheli) River at East West Highway"
              titleStyle="text-xl/6 font-semibold"
              description="Doda (Machheli) river at East West Highway"
              updatedAt={updatedAt}
            />
            <div>
              <Badge>Steady</Badge>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {cardData?.map((d) => {
              const Icon = d.icon;
              return (
                <div className="flex space-x-3 items-center" key={d.label}>
                  <div>
                    <Icon className="text-gray-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm/6 font-medium mb-1">{d.label}</p>
                    {d.label === 'Discharge Tendency' ? (
                      <img
                        src={d.value}
                        alt="Discharge Tendency"
                        className="w-4 h-4 object-cover"
                      />
                    ) : (
                      <p className="text-sm/4 text-gray-600">{d.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 rounded-sm border shadow min-w-max">
          <div>
            <p className="font-semibold text-xl/10">Maximum Probability</p>
            <p className="text-xs/4">
              Max Probability Step:{' '}
              {glofas?.info?.pointForecastData?.maxProbabilityStep?.data}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-4 text-center">
              <div className="text-primary font-semibold">{val2yr} mm</div>
              <div className="text-sm mt-1">2 years</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-primary font-semibold">{val5yr} mm</div>
              <div className="text-sm mt-1">5 years</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-primary font-semibold">{val20yr} mm</div>
              <div className="text-sm mt-1">20 years</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
