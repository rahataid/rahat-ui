import React from 'react';
import { TableLoader, NoResult } from 'apps/rahat-ui/src/common';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import TimeSeriesChart from '../../dhm/chart';
import WaterLevelTable from '../../dhm/table';
import { roundValue } from '../utils/color.utils';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface TemperatureHistorySectionProps {
  activeTab: 'hourly' | 'daily';
  onTabChange: (value: 'hourly' | 'daily') => void;
  isLoading: boolean;
  hasData: boolean;
  isNoDataError: boolean;
  history: Record<string, unknown>[];
  columns: ColumnDef<any>[];
  unit?: string;
  title?: string;
  yaxisLabel?: string;
  noDataLabel?: string;
}

export function TemperatureHistorySection({
  activeTab,
  onTabChange,
  isLoading,
  hasData,
  isNoDataError,
  history,
  columns,
  unit = '°C',
  title,
  yaxisLabel,
  noDataLabel,
}: TemperatureHistorySectionProps) {
  const t = useTranslations('AA_PROJECT');
  const resolvedTitle = title ?? t('TEMPERATURE_HISTORY');
  const resolvedYaxisLabel = yaxisLabel ?? t('TEMPERATURE_LABEL');
  const resolvedNoDataLabel = noDataLabel ?? t('TEMPERATURE_LABEL');
  const renderContent = (timeFormat: 'h:mm a' | 'MMM d', period: string) => {
    if (isLoading) {
      return <TableLoader />;
    }

    if (hasData) {
      return (
        <>
          <TimeSeriesChart
            data={history}
            yaxisTitle={`${resolvedYaxisLabel} (${unit})`}
            unit={unit}
            xDateFormat={timeFormat}
            yAxisFormatter={(value) => roundValue(value)}
          />
          <div className='h-[200px] overflow-auto '>
            <WaterLevelTable tableData={history} columns={columns} />
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center justify-center p-8">
        <NoResult
          message={`No ${period} ${resolvedNoDataLabel} data available for this period`}
        />
      </div>
    );
  };

  return (
    <div className="p-4 rounded-sm border shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-lg/7 font-semibold">{resolvedTitle}</p>
        <Tabs
          value={activeTab}
          onValueChange={(v) => onTabChange(v as 'hourly' | 'daily')}
        >
          <TabsList>
            <TabsTrigger value={t('HOURLY')}>{t('HOURLY')}</TabsTrigger>
            <TabsTrigger value={t('DAILY')}>{t('DAILY')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as 'hourly' | 'daily')}
      >
        <TabsContent value={t('HOURLY')}>
          {renderContent('h:mm a', 'hourly')}
        </TabsContent>

        <TabsContent value={t('DAILY')}>
          {renderContent('MMM d', 'daily')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
