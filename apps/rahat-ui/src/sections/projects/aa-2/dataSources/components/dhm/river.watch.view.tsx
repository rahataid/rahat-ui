import {
  PROJECT_SETTINGS_KEYS,
  useDhmWaterLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { format } from 'date-fns';
import { MapPin, RadioTower, Skull, TriangleAlert } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

export default function RiverWatchView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));
  const formattedDate = format(new Date(), 'yyyy/MM/dd');

  const { data: riverWatch, isLoading } = useDhmWaterLevels(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
    type: 'POINT',
    from: formattedDate,
    to: formattedDate,
  });

  const cardData = React.useMemo(
    () => [
      {
        icon: RadioTower,
        label: 'Station Index',
        value: riverWatch?.info?.stationIndex,
      },
      {
        icon: MapPin,
        label: 'District',
        value: riverWatch?.info?.district,
      },
      {
        icon: TriangleAlert,
        label: 'Warning Level',
        value: riverWatch?.info?.warning_level,
      },
      {
        icon: Skull,
        label: 'Danger Level',
        value: riverWatch?.info?.danger_level,
      },
    ],
    [riverWatch],
  );
  return isLoading ? (
    <TableLoader />
  ) : (
    <div className="flex flex-col space-y-4">
      <div
        className="p-4 rounded-sm border shadow flex justify-between space-x-4 cursor-pointer hover:shadow-md"
        onClick={() =>
          router.push(
            `/projects/aa/${projectId}/data-sources/dhm/river-watch/${riverWatch?.id}`,
          )
        }
      >
        <div className="w-full">
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
              ? 'bg-green-400'
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
    </div>
  );
}
