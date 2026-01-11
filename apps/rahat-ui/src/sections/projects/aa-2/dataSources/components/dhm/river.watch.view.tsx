import {
  PROJECT_SETTINGS_KEYS,
  useDhmWaterLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading, NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  renderCardColor,
  renderStatusColor,
} from 'apps/rahat-ui/src/utils/getColorCard';
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

  const updatedAt = riverWatch?.updatedAt;

  const riverWatchInfoList = riverWatch?.info ?? [];

  // modification required to handle multiple rivers
  const primaryRiverWatchInfo = riverWatchInfoList[0] ?? null;

  const cardData = React.useMemo(
    () => [
      {
        icon: RadioTower,
        label: 'Station Index',
        value: primaryRiverWatchInfo?.stationIndex,
      },
      {
        icon: MapPin,
        label: 'District',
        value: primaryRiverWatchInfo?.district,
      },
      {
        icon: TriangleAlert,
        label: 'Warning Level',
        value: primaryRiverWatchInfo?.warning_level,
      },
      {
        icon: Skull,
        label: 'Danger Level',
        value: primaryRiverWatchInfo?.danger_level,
      },
    ],
    [riverWatch],
  );

  if (isLoading) {
    return <TableLoader />;
  }

  if (!riverWatch || !primaryRiverWatchInfo) {
    return (
      <div className="p-4">
        <NoResult message="No River Watch Data" />
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-4">
      <div
        className="p-4 rounded-sm border shadow flex justify-between space-x-4 cursor-pointer hover:shadow-md"
        onClick={() =>
          router.push(
            `/projects/aa/${projectId}/data-sources/dhm/river-watch/${primaryRiverWatchInfo?.series_id}`,
          )
        }
      >
        <div className="w-full">
          <div className="flex justify-between gap-4">
            <Heading
              title={primaryRiverWatchInfo?.name}
              titleStyle="text-xl/6 font-semibold"
              description={primaryRiverWatchInfo?.basin}
              updatedAt={updatedAt}
            />
            <div>
              <Badge>{primaryRiverWatchInfo?.steady}</Badge>
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
          className={`p-4 rounded-sm border shadow text-center w-64 ${renderCardColor(
            primaryRiverWatchInfo?.status,
          )}`}
        >
          <p className="text-primary font-semibold text-3xl/10">
            {primaryRiverWatchInfo?.waterLevel?.value}
          </p>
          <p className="text-sm/6 font-medium">Water Level</p>
          <p className="text-gray-500 text-sm/6">
            {dateFormat(
              primaryRiverWatchInfo?.waterLevel?.datetime,
              'eee, MMM d yyyy, hh:mm:ss a',
            )}
          </p>
          <Badge
            className={`${renderStatusColor(primaryRiverWatchInfo?.status)}`}
          >
            {primaryRiverWatchInfo?.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
