import {
  PROJECT_SETTINGS_KEYS,
  useDhmTemperatureLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Heading, NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { Globe, RadioTower } from 'lucide-react';
import React, { useMemo } from 'react';
import { UUID } from 'crypto';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { getTemperatureColor } from './utils/color.utils';
import { TemperatureValueCard } from './components';

export default function TemperatureWatchView() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const formattedDate = format(new Date(), 'yyyy/MM/dd');
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const payload = {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
    from: formattedDate,
  };

  const { data, isLoading } = useDhmTemperatureLevels(projectId, payload);

  const tn1hData = useMemo(() => {
    if (!data?.info || !Array.isArray(data.info)) return [];
    return data.info.filter((item: any) => item?.parameter_code === 'T_1H');
  }, [data]);

  const updatedAt = data?.updatedAt;

  if (isLoading) {
    return <TableLoader />;
  }

  if (tn1hData.length === 0) {
    return (
      <div className="p-4">
        <NoResult message="No Temperature Data" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {tn1hData.map((tempInfo: any, index: number) => {
        const colors = getTemperatureColor(tempInfo?.value);
        const seriesId = tempInfo?.series_id || tempInfo?.id || String(index);

        const stationInfo = [
          { icon: RadioTower, label: 'Station', value: tempInfo?.name || '--' },
          { icon: Globe, label: 'Latitude', value: tempInfo?.latitude ?? '--' },
          {
            icon: Globe,
            label: 'Longitude',
            value: tempInfo?.longitude ?? '--',
          },
        ];

        return (
          <div
            key={seriesId}
            className="p-4 rounded-sm border shadow flex justify-between space-x-4 cursor-pointer hover:shadow-md"
            onClick={() =>
              router.push(
                `/projects/aa/${projectId}/data-sources/aws/temperature-watch/${seriesId}`,
              )
            }
          >
            <div className="w-full">
              <div className="flex justify-between gap-4">
                <Heading
                  title={tempInfo?.name || 'Unknown Station'}
                  titleStyle="text-xl/6 font-semibold"
                  description={
                    tempInfo?.parameter_name || 'Air Temperature Hourly'
                  }
                  updatedAt={updatedAt}
                />
                <div>
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 ${colors.statusColor}`}
                  >
                    {colors.statusLabel}
                  </span>
                </div>
              </div>

              {/* Station Info Grid */}
              <div className="grid grid-cols-3 gap-4">
                {stationInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className="flex space-x-3 items-center"
                      key={item.label}
                    >
                      <div>
                        <Icon className="text-gray-500" size={20} />
                      </div>
                      <div>
                        <p className="text-sm/6 font-medium mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm/4 text-gray-600">
                          {item.value ?? '--'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <TemperatureValueCard
              value={tempInfo?.value}
              unit={tempInfo?.unit ?? '°C'}
              updatedAt={updatedAt}
              label="Hourly Temperature"
              colors={colors}
            />
          </div>
        );
      })}
    </div>
  );
}
