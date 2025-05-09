import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { Globe, MapPin, RadioTower, TrendingUp } from 'lucide-react';
import React from 'react';

export function Info({ riverWatch }: any) {
  const cardData = React.useMemo(
    () => [
      {
        icon: RadioTower,
        label: 'Station Index',
        value: riverWatch?.info?.stationIndex,
      },
      {
        icon: Globe,
        label: 'Latitude',
        value: riverWatch?.info?.latitude,
      },
      {
        icon: Globe,
        label: 'Longitude',
        value: riverWatch?.info?.longitude,
      },
      {
        icon: TrendingUp,
        label: 'Elevation',
        value: riverWatch?.info?.elevation,
      },
      {
        icon: MapPin,
        label: 'District',
        value: riverWatch?.info?.district,
      },
    ],
    [riverWatch],
  );

  return (
    <div className="flex justify-between space-x-4">
      <div className="p-4 rounded-sm border shadow w-full">
        <div className="flex justify-between gap-4">
          <Heading
            title={riverWatch?.info?.name}
            titleStyle="text-xl/6 font-semibold"
            description={riverWatch?.info?.description}
          />
          <div>
            <Badge>{riverWatch?.info?.steady}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {cardData?.map((d) => {
            const Icon = d.icon;
            return (
              <div className="flex space-x-3 items-center">
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
        className={`p-4 rounded-sm border shadow text-center w-64 ${
          riverWatch?.info?.status === 'BELOW WARNING LEVEL'
            ? 'bg-green-100 border-green-500'
            : ''
        }`}
      >
        <p className="text-primary font-semibold text-3xl/10">
          {riverWatch?.info?.waterLevel?.value}
        </p>
        <p className="text-sm/6 font-medium">Water Level</p>
        <p className="text-gray-500 text-sm/6">
          {new Date(riverWatch?.info?.waterLevel?.datetime).toLocaleString()}
        </p>
        <Badge>{riverWatch?.info?.status}</Badge>
      </div>
    </div>
  );
}
