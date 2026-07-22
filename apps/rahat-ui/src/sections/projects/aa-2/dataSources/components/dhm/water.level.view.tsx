import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import { useTranslations } from 'next-intl';

import InputCalendar from './input.calendar';
import PointWaterLevel from './point.water.level';
import HourlyAndDailyWaterLevel from './hourly.and.daily.water.level';
import React, { Dispatch, SetStateAction } from 'react';

type IProps = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  data: any;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
};

export function WaterLevelView({
  activeTab,
  setActiveTab,
  data,
  selectedDate,
  setSelectedDate,
}: IProps) {
  const t = useTranslations('AA Project');
  return (
    <div className="p-4 rounded-sm border shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <Heading
            title={t('WATER_LEVEL')}
            titleStyle="font-semibold text-lg/7"
            description={t('CHART_AND_TABLE_SHOWING_WATERLEVEL')}
          />
          <div className="flex space-x-2">
            <TabsList className="border bg-secondary rounded mb-2">
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value={t('POINT')}
              >
                Point
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value={t('HOURLY')}
              >
                Hourly
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value={t('DAILY')}
              >
                Daily
              </TabsTrigger>
            </TabsList>
            <InputCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
        <TabsContent value={t('POINT')}>
          <PointWaterLevel
            waterLevels={data?.history}
            dangerLevel={data?.danger_level}
            warningLevel={data?.warning_level}
          />
        </TabsContent>
        <TabsContent value={t('HOURLY')}>
          <HourlyAndDailyWaterLevel
            waterLevels={data?.history}
            dangerLevel={data?.danger_level}
            warningLevel={data?.warning_level}
          />
        </TabsContent>
        <TabsContent value={t('DAILY')}>
          <HourlyAndDailyWaterLevel
            waterLevels={data?.history}
            dangerLevel={data?.danger_level}
            warningLevel={data?.warning_level}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
