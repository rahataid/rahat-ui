import { useGaugeReading } from '@rahat-ui/query';
import React, { useMemo } from 'react';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import GaugeForecastCard from './gaugeForecastCard';
import { NoResult } from 'apps/rahat-ui/src/common';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { getGaugeUnit } from 'apps/rahat-ui/src/utils/getGaugeUnit';

interface IGaugeReadingProps {
  date: Date | null;
}

interface GaugeData {
  sourceId: number;
  date: string;
  station: string;
  dataEntryBy: string;
  riverBasin: string;
  gaugeForecast: string;
  totalGaugeReading: number;
  latestGaugeReading: number;
  count: number;
  createdBy: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const GaugeReading = ({ date }: IGaugeReadingProps) => {
  const params = useParams();
  const projectId = params.id as UUID;
  const { data: MonitoringData, isLoading } = useGaugeReading(projectId, {});

  const filteredData = useMemo(() => {
    if (!MonitoringData?.data) return [];
    if (!date) return MonitoringData.data;

    const filterDateString = format(date, 'yyyy-MM-dd');
    return MonitoringData.data.filter(
      (item: GaugeData) => item.date === filterDateString,
    );
  }, [MonitoringData?.data, date]);

  if (isLoading) {
    return (
      <div className="mx-auto space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!filteredData?.length) {
    return (
      <div className="p-4">
        <NoResult message="No Gauge Reading Data" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-4 max-h-[calc(100vh-230px)] overflow-y-auto">
      {filteredData.map((item: GaugeData) => {
        const unit = getGaugeUnit(item?.gaugeForecast);
        return (
          <Link
            href={`/projects/aa/${projectId}/data-sources/forecast-data?sourceId=${item?.sourceId}&station=${item?.station}&date=${item?.createdAt}&gaugeForecast=${item?.gaugeForecast}&riverBasin=${item?.riverBasin}&latestGaugeReading=${item?.latestGaugeReading}&dataEntryBy=${item?.dataEntryBy}&filterDate=${item?.date}`}
            key={`${item?.riverBasin}_${item?.date}_${item?.station}_${item?.gaugeForecast}`}
          >
            <GaugeForecastCard
              riverBasin={item?.riverBasin}
              gaugeForecast={item?.gaugeForecast}
              station={item?.station}
              latestGaugeReading={item?.latestGaugeReading}
              dataEntryBy={item?.dataEntryBy}
              date={item?.createdAt}
              unit={unit}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default GaugeReading;
