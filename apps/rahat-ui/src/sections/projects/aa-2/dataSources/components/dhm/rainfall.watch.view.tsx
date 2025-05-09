import {
  PROJECT_SETTINGS_KEYS,
  useDhmRainfallLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { MapPin, RadioTower, Skull, TriangleAlert, Waves } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { RainFallMonitor } from './rainfall.monitor';
import { format } from 'date-fns';

export default function RainfallWatchView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const formattedDate = format(new Date(), 'yyyy/MM/dd');
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));
  const { data: rainfallWatch, isLoading } = useDhmRainfallLevels(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
    type: 'HOURLY',
    from: formattedDate,
    to: formattedDate,
  });

  const hoursList = [1, 3, 6, 12, 24];

  const timeIntervals = hoursList.map((hours) => {
    const dataPoint = rainfallWatch?.info?.history[hours];
    return {
      hours,
      warningLevel: dataPoint?.value,
    };
  });

  console.log(rainfallWatch?.info);

  const cardData = React.useMemo(
    () => [
      {
        icon: Waves,
        label: 'Basin Name',
        value: rainfallWatch?.info?.basin,
      },
      {
        icon: RadioTower,
        label: 'Station Index',
        value: rainfallWatch?.info?.stationIndex,
      },
      {
        icon: MapPin,
        label: 'District',
        value: rainfallWatch?.info?.district,
      },
      {
        icon: TriangleAlert,
        label: 'Warning Level',
        value: rainfallWatch?.info?.warning_level || 'N/A',
      },
      {
        icon: Skull,
        label: 'Danger Level',
        value: rainfallWatch?.info?.danger_level || 'N/A',
      },
    ],
    [rainfallWatch],
  );

  return isLoading ? (
    <TableLoader />
  ) : (
    <div className="flex flex-col space-y-4">
      {/* <div className="p-4 rounded-sm border shadow flex justify-between space-x-4">
        <div className="w-full">
          <div className="flex justify-between gap-4">
            <Heading
              title={rainfallWatch?.info?.name}
              titleStyle="text-xl/6 font-semibold"
              description={rainfallWatch?.info?.description}
            />
            <div>
              <Badge>{rainfallWatch?.info?.steady || 'N/A'}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
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
          className={`p-4 rounded-sm border shadow text-center w-64 ${
            rainfallWatch?.info?.status === 'BELOW WARNING LEVEL'
              ? 'bg-green-500'
              : ''
          }`}
        >
          <p className="text-primary font-semibold text-3xl/10">N/A</p>
          <p className="text-sm/6 font-medium">Water Level</p>
          <p className="text-gray-500 text-sm/6">N/A</p>
          <Badge>{rainfallWatch?.info?.status}</Badge>
        </div>
      </div> */}
      <RainFallMonitor
        name={rainfallWatch?.info?.name}
        description={rainfallWatch?.info?.description}
        warningStatus={rainfallWatch?.info?.status}
        stationIndex={rainfallWatch?.info?.stationIndex}
        district={rainfallWatch?.info?.district}
        timeIntervals={timeIntervals}
      />
    </div>
  );
}
