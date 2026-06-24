'use client';

import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDhmSingleSeriesTemperatureLevels } from '@rahat-ui/query';
import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { Globe, RadioTower } from 'lucide-react';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { getTemperatureColor, getLatestValue } from './utils/color.utils';
import React, { useState, useMemo } from 'react';
import { useTemperatureTableColumns } from '../../columns/useTemperatureTableColumns';
import TemperatureWatchMap from './temperature.watch.map';
import {
  TemperatureValueCard,
  TemperatureScaleBar,
  TemperatureHistorySection,
} from './components';

export default function TemperatureWatchDetails() {
  const { id: projectId } = useParams() as { id: UUID };
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');

  const { data, isLoading, error } = useDhmSingleSeriesTemperatureLevels(
    projectId,
    { type: activeTab },
  );

  const tempInfo = data?.info;
  const updatedAt = data?.updatedAt;
  const columns = useTemperatureTableColumns(tempInfo?.unit ?? '°C');

  const history = useMemo(() => tempInfo?.history ?? [], [tempInfo?.history]);

  const latestEntry = getLatestValue(history);
  const latestValue = latestEntry?.value ?? tempInfo?.value;
  const latestDate = latestEntry?.datetime ?? tempInfo?.updatedAt;

  const isNoDataError = useMemo(() => {
    if (!error) return false;
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || '';
    return (
      message.includes('No heatwave data found') ||
      message.includes('No data found')
    );
  }, [error]);

  const stationInfo = useMemo(
    () => [
      {
        icon: RadioTower,
        label: 'Station',
        value: tempInfo?.name || 'Unknown',
      },
      { icon: Globe, label: 'Latitude', value: tempInfo?.latitude || '--' },
      { icon: Globe, label: 'Longitude', value: tempInfo?.longitude || '--' },
    ],
    [tempInfo],
  );

  const colors = useMemo(
    () =>
      latestValue != null
        ? getTemperatureColor(latestValue)
        : {
            statusColor: 'bg-gray-400',
            bg: 'bg-gray-50',
            textValue: 'text-gray-500',
            border: 'border-gray-200',
            badge: 'bg-gray-400',
          },
    [latestValue],
  );

  const mapCoordinates = useMemo(
    () =>
      tempInfo
        ? [
            {
              name: tempInfo.name,
              latitude: tempInfo.latitude,
              longitude: tempInfo.longitude,
              stationIndex: tempInfo.stationIndex,
              value: latestValue ?? tempInfo.value,
              unit: tempInfo.unit ?? '°C',
              statusColor: colors.statusColor,
              bgColor: colors.bg,
            },
          ]
        : [],
    [tempInfo, colors, latestValue],
  );

  if (isLoading) return <TableLoader />;

  // Only show error page for non-data errors
  if (error && !isNoDataError) {
    return (
      <div className="p-4">
        <Back />
        <p className="text-sm text-red-500">
          Error loading data:{' '}
          {(
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.response?.data?.message ||
            (error as { message?: string }).message ||
            String(error)}
        </p>
      </div>
    );
  }

  const hasData = !isNoDataError && tempInfo && history.length > 0;

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div>
        <Back />
        <Heading title="DHM Heatwave" description="" />
      </div>

      {/* No Data Warning */}
      {isNoDataError && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-sm">
          <p className="text-sm text-yellow-800">
            <strong>No data available:</strong> There is currently no heatwave
            data available for the selected time period ({activeTab}).
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
                      title={tempInfo?.name || 'Unknown Station'}
                      titleStyle="text-xl/6 font-semibold"
                      description={
                        tempInfo?.parameter_name || 'Air Temperature Hourly'
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
                unit={tempInfo?.unit ?? '°C'}
                updatedAt={latestDate}
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

          {/* Map with Temperature Scale */}
          <div className="flex gap-4">
            <TemperatureScaleBar unit="°C" />
            <div className="flex-1">
              <TemperatureWatchMap
                coordinates={mapCoordinates}
                title="Map"
                description="Temperature Station Location"
                indicatorTitle="Temperature Station"
                popupLabel="Temperature"
                unitLabel="°C"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Temperature History */}
        <TemperatureHistorySection
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isLoading={isLoading}
          hasData={hasData}
          isNoDataError={isNoDataError}
          history={history}
          columns={columns}
          unit={tempInfo?.unit ?? '°C'}
          title="Temperature History"
          yaxisLabel="Temperature"
          noDataLabel="temperature"
        />
      </div>
    </div>
  );
}
