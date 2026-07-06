'use client';

import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDhmSingleSeriesHumidityLevels } from '@rahat-ui/query';
import { Back, Heading, TableLoader, NoResult } from 'apps/rahat-ui/src/common';
import { Globe, RadioTower } from 'lucide-react';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  getHumidityColor,
  getLatestValue,
  roundValue,
} from './utils/color.utils';
import React, { useMemo } from 'react';
import { useTemperatureTableColumns } from '../../columns/useTemperatureTableColumns';
import TemperatureWatchMap from './temperature.watch.map';
import { TemperatureValueCard, HumidityScaleBar } from './components';
import TimeSeriesChart from '../dhm/chart';
import WaterLevelTable from '../dhm/table';

export default function HumidityWatchDetails() {
  const { id: projectId } = useParams() as { id: UUID };

  const { data, isLoading, error } =
    useDhmSingleSeriesHumidityLevels(projectId);

  const humidityInfo = data?.info;
  const updatedAt = data?.updatedAt;
  const columns = useTemperatureTableColumns(
    humidityInfo?.unit ?? '%',
    'Relative Humidity',
  );

  const history = useMemo(
    () => humidityInfo?.history ?? [],
    [humidityInfo?.history],
  );

  const latestEntry = getLatestValue(history);
  const latestValue = latestEntry?.value ?? humidityInfo?.value;
  const latestDate = latestEntry?.datetime ?? humidityInfo?.updatedAt;

  const isNoDataError = useMemo(() => {
    if (!error) return false;
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || '';
    return (
      message.includes('No data found') ||
      message.includes('No humidity data found') ||
      message.includes('No heatwave data found')
    );
  }, [error]);

  const stationInfo = useMemo(
    () => [
      {
        icon: RadioTower,
        label: 'Station',
        value: humidityInfo?.name || 'Unknown',
      },
      { icon: Globe, label: 'Latitude', value: humidityInfo?.latitude || '--' },
      {
        icon: Globe,
        label: 'Longitude',
        value: humidityInfo?.longitude || '--',
      },
    ],
    [humidityInfo],
  );

  const colors = useMemo(() => {
    const latestEntry = getLatestValue(history);
    const latestValue = latestEntry?.value ?? humidityInfo?.value;
    return latestValue != null
      ? getHumidityColor(latestValue)
      : {
          statusColor: 'bg-gray-400',
          bg: 'bg-gray-50',
          textValue: 'text-gray-500',
          border: 'border-gray-200',
          badge: 'bg-gray-400',
        };
  }, [humidityInfo?.value, history]);

  const mapCoordinates = useMemo(
    () =>
      humidityInfo
        ? [
            {
              name: humidityInfo.name || 'Unknown',
              latitude: humidityInfo.latitude,
              longitude: humidityInfo.longitude,
              stationIndex: humidityInfo.stationIndex,
              value: getLatestValue(history)?.value ?? humidityInfo.value,
              unit: humidityInfo.unit ?? '%',
              statusColor: colors.statusColor,
              bgColor: colors.bg,
            },
          ]
        : [],
    [humidityInfo, history, colors],
  );

  if (isLoading) return <TableLoader />;

  const hasData = !isNoDataError && humidityInfo && history.length > 0;

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div>
        <Back />
        <Heading title="Relative Humidity" description="" />
      </div>

      {isNoDataError && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-sm">
          <p className="text-sm text-yellow-800">
            <strong>No data available:</strong> There is currently no humidity
            data available for the selected time period.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          <div className="p-4 rounded-sm border shadow">
            <div className="flex justify-between items-start gap-4">
              {/* Station Header */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Heading
                      title={humidityInfo?.name || 'Unknown Station'}
                      titleStyle="text-xl/6 font-semibold"
                      description={
                        humidityInfo?.parameter_name || 'Air Humidity Hourly'
                      }
                    />
                  </div>
                </div>
                <p className="text-sm text-green-600">
                  Last Synced at:{' '}
                  {updatedAt
                    ? dateFormat(updatedAt, 'MMMM dd, yyyy, hh:mm:ss a')
                    : 'Not available'}
                </p>
              </div>

              <TemperatureValueCard
                value={latestValue}
                unit={humidityInfo?.unit ?? '%'}
                updatedAt={latestDate}
                label="Relative Humidity"
                colors={colors}
              />
            </div>

            {/* Station Info Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {stationInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="flex space-x-3 items-center" key={item.label}>
                    <div>
                      <Icon className="text-gray-500" size={20} />
                    </div>
                    <div>
                      <p className="text-sm/6 font-medium mb-1">{item.label}</p>
                      <p className="text-sm/4 text-gray-600">
                        {item.value ?? '--'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map with Humidity Scale */}
          <div className="flex gap-4">
            <HumidityScaleBar unit="%" />
            <div className="flex-1">
              <TemperatureWatchMap
                coordinates={mapCoordinates}
                title="Map"
                description="Humidity Station Location"
                indicatorTitle="Humidity Station"
                popupLabel="Humidity"
                unitLabel="%"
                indicatorGradient="from-blue-900 via-cyan-500 to-cyan-100"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Humidity History */}
        <div className="p-4 rounded-sm border shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-lg/7 font-semibold">Relative Humidity History</p>
          </div>

          {isLoading ? (
            <TableLoader />
          ) : hasData ? (
            <>
              <TimeSeriesChart
                data={history}
                yaxisTitle={`Relative Humidity (${humidityInfo?.unit ?? '%'})`}
                unit={humidityInfo?.unit ?? '%'}
                xDateFormat={'h:mm a'}
                yAxisFormatter={(value) => roundValue(value)}
              />
              <div className="h-[200px] overflow-auto ">
                <WaterLevelTable tableData={history} columns={columns} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center p-8">
              <NoResult message="No hourly humidity data available for this period" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
