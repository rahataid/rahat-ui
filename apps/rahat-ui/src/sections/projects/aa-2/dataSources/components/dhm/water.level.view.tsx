import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
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
  return (
    <div className="p-4 rounded-sm border shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <Heading
            title="Water Level"
            titleStyle="font-semibold text-lg/7"
            description="Chart and table showing waterlevel"
          />
          <div className="flex space-x-2">
            <TabsList className="border bg-secondary rounded mb-2">
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value="Point"
              >
                Point
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value="Hourly"
              >
                Hourly
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value="Daily"
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
        <TabsContent value="Point">
          <PointWaterLevel
            waterLevels={data?.info?.history}
            dangerLevel={data?.info?.danger_level}
            warningLevel={data?.info?.warning_level}
          />
        </TabsContent>
        <TabsContent value="Hourly">
          <HourlyAndDailyWaterLevel
            waterLevels={data?.info?.history}
            dangerLevel={data?.info?.danger_level}
            warningLevel={data?.info?.warning_level}
          />
        </TabsContent>
        <TabsContent value="Daily">
          <HourlyAndDailyWaterLevel
            waterLevels={data?.info?.history}
            dangerLevel={data?.info?.danger_level}
            warningLevel={data?.info?.warning_level}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
