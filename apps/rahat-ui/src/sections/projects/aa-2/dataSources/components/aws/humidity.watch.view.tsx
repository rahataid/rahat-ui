import {
  PROJECT_SETTINGS_KEYS,
  useDhmHumidityLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Heading, NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { Globe, RadioTower } from 'lucide-react';
import React, { useMemo } from 'react';
import { UUID } from 'crypto';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { getHumidityColor, getLatestValue } from './utils/color.utils';
import { TemperatureValueCard } from './components';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function HumidityWatchView() {
  const formatNum = useNumberFormat();
  const t = useTranslations('AA_PROJECT');
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

  const { data, isLoading } = useDhmHumidityLevels(projectId, payload);

  const rh1hData = useMemo(() => {
    if (!data?.info || !Array.isArray(data.info)) return [];
    return data.info.filter((item: any) => item?.parameter_code === 'RH_1H');
  }, [data]);

  const updatedAt = data?.updatedAt;

  if (isLoading) {
    return <TableLoader />;
  }

  if (rh1hData.length === 0) {
    return (
      <div className="p-4">
        <NoResult message={t('NO_HUMIDITY_DATA')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {rh1hData.map((humInfo: any, index: number) => {
        const latestEntry = getLatestValue(humInfo?.history);
        const latestValue = latestEntry?.value ?? humInfo?.value;
        const latestDate = latestEntry?.datetime ?? humInfo?.updatedAt;
        const colors = getHumidityColor(latestValue);
        const seriesId = humInfo?.series_id || humInfo?.id || String(index);

        return (
          <div
            key={seriesId}
            className="p-4 rounded-sm border shadow flex justify-between space-x-4 cursor-pointer hover:shadow-md"
            onClick={() =>
              router.push(
                `/projects/aa/${projectId}/data-sources/aws/humidity-watch/${seriesId}`,
              )
            }
          >
            <div className="w-full">
              <div className="flex justify-between gap-4">
                <Heading
                  title={humInfo?.name || t('UNKNOWN_STATION')}
                  titleStyle="text-xl/6 font-semibold"
                  description={
                    humInfo?.parameter_name || t('RELATIVE_HUMIDITY_HOURLY')
                  }
                  updatedAt={updatedAt}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex space-x-3 items-center">
                  <RadioTower className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm/6 font-medium mb-1">{t('STATION')}</p>
                    <p className="text-sm/4 text-gray-600">
                      {humInfo?.name || '--'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 items-center">
                  <Globe className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm/6 font-medium mb-1">{t('LATITUDE')}</p>
                    <p className="text-sm/4 text-gray-600">
                      {humInfo?.latitude !== undefined
                        ? formatNum(humInfo.latitude)
                        : '--'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 items-center">
                  <Globe className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm/6 font-medium mb-1">{t('LONGITUDE')}</p>
                    <p className="text-sm/4 text-gray-600">
                      {humInfo?.longitude !== undefined
                        ? formatNum(humInfo.longitude)
                        : '--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <TemperatureValueCard
              value={latestValue}
              unit={humInfo?.unit ?? '%'}
              updatedAt={latestDate}
              label={t('RELATIVE_HUMIDITY')}
              colors={colors}
            />
          </div>
        );
      })}
    </div>
  );
}
