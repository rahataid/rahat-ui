import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  renderCardColor,
  renderStatusColor,
} from 'apps/rahat-ui/src/utils/getColorCard';
import { Globe, MapPin, RadioTower, TrendingUp } from 'lucide-react';
import React from 'react';
interface InfoProp {
  riverWatch: {
    stationIndex: number;
    latitude: number;
    longitude: number;
    description: string;
    elevation: number;
    district: string;
    name: string;
    steady: string;
    status: string;
    waterLevel: { value: number; datetime: string };
  };
  updatedAt: string;
}

export function Info({ riverWatch, updatedAt }: InfoProp) {
  const cardData = React.useMemo(
    () => [
      {
        icon: RadioTower,
        label: 'Station Index',
        value: riverWatch?.stationIndex,
      },
      {
        icon: Globe,
        label: 'Latitude',
        value: riverWatch?.latitude,
      },
      {
        icon: Globe,
        label: 'Longitude',
        value: riverWatch?.longitude,
      },
      {
        icon: TrendingUp,
        label: 'Elevation',
        value: riverWatch?.elevation,
      },
      {
        icon: MapPin,
        label: 'District',
        value: riverWatch?.district,
      },
    ],
    [riverWatch],
  );

  return (
    <div className="flex justify-between space-x-4">
      <div className="p-4 rounded-sm border shadow w-full">
        <div className="flex justify-between gap-4">
          <Heading
            title={riverWatch?.name}
            titleStyle="text-xl/6 font-semibold"
            description={riverWatch?.description}
            updatedAt={updatedAt}
          />
          <div>
            <Badge>{riverWatch?.steady}</Badge>
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
                  <p className="text-sm/4 text-gray-600">{d.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`p-4 rounded-sm border shadow text-center w-64 ${renderCardColor(
          riverWatch?.status,
        )}`}
      >
        <p className="text-primary font-semibold text-3xl/10">
          {riverWatch?.waterLevel?.value}
        </p>
        <p className="text-sm/6 font-medium">Water Level</p>
        <p className="text-gray-500 text-sm/6">
          {dateFormat(
            riverWatch?.waterLevel?.datetime,
            'eee, MMM d yyyy, hh:mm:ss a',
          )}
        </p>
        <Badge className={`${renderStatusColor(riverWatch?.status)}`}>
          {riverWatch?.status}
        </Badge>
      </div>
    </div>
  );
}
