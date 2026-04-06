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
  title = 'Temperature History',
  yaxisLabel = 'Temperature',
  noDataLabel = 'temperature',
}: TemperatureHistorySectionProps) {
  const renderContent = (timeFormat: 'h:mm a' | 'MMM d', period: string) => {
    if (isLoading) {
      return <TableLoader />;
    }

    if (hasData) {
      return (
        <>
          <TimeSeriesChart
            data={history}
            yaxisTitle={`${yaxisLabel} (${unit})`}
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
          message={`No ${period} ${noDataLabel} data available for this period`}
        />
      </div>
    );
  };

  return (
    <div className="p-4 rounded-sm border shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-lg/7 font-semibold">{title}</p>
        <Tabs
          value={activeTab}
          onValueChange={(v) => onTabChange(v as 'hourly' | 'daily')}
        >
          <TabsList>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as 'hourly' | 'daily')}
      >
        <TabsContent value="hourly">
          {renderContent('h:mm a', 'hourly')}
        </TabsContent>

        <TabsContent value="daily">
          {renderContent('MMM d', 'daily')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
