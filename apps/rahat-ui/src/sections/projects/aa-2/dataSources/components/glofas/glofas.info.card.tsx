import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  Calendar,
  TriangleAlert,
  ChartLine,
  ChartNoAxesColumn,
} from 'lucide-react';
import React from 'react';
import { formateDateFromText } from './utils/formateDataFormTextData';

type IProps = {
  glofas: Record<string, any>;
};

export default function GlofasInfoCard({ glofas }: IProps) {
  const cardData = React.useMemo(
    () => [
      {
        icon: Calendar,
        label: 'Forecast Date',
        value: dateFormat(glofas?.info?.forecastDate, 'MMMM d, yyyy'),
      },
      {
        icon: Calendar,
        label: 'Return Period',
        value: glofas?.info?.returnPeriod || 'N/A',
      },
      {
        icon: ChartNoAxesColumn,
        label: 'Discharge Tendency',
        value: glofas?.info?.pointForecastData?.dischargeTendencyImage?.data,
      },
      {
        icon: ChartLine,
        label: 'Peak Forecasted',
        value: formateDateFromText(
          glofas?.info?.pointForecastData?.peakForecasted?.data,
        ),
      },
      {
        icon: TriangleAlert,
        label: 'Alert Level',
        value: glofas?.info?.pointForecastData?.alertLevel?.data,
      },
    ],
    [glofas],
  );
  return (
    <div className="flex flex-col space-y-4">
      <div className="p-4 rounded-sm border shadow flex justify-between space-x-4">
        <div className="w-full">
          <div className="flex justify-between gap-4 z-50">
            <Heading
              title={glofas?.source?.riverBasin}
              titleStyle="text-xl/6 font-semibold"
              description={glofas?.source?.riverBasin}
              updatedAt={glofas?.updatedAt}
            />
            <div>
              <Badge className="font-light">Steady</Badge>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
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
          <div className="text-center">
            <p className="font-semibold text-xl/10">Maximum Probability</p>
            <p className="text-xs/4">
              Max Probability Step:{' '}
              {glofas?.info?.pointForecastData?.maxProbabilityStep?.data ||
                'N/A'}
            </p>
          </div>

          <div className="pt-2 text-center">
            <div className="text-primary font-semibold">
              {glofas?.info?.pointForecastData?.maxProbability?.data || 'N/A'} %
            </div>
            <div className="text-sm">{glofas?.info?.returnPeriod}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
