import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
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

export function WaterLevelView() {
  return (
    <div className="p-4 rounded-sm border shadow">
      <Tabs defaultValue="Point">
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
            <InputCalendar />
          </div>
        </div>
        <TabsContent value="Point">
          <PointWaterLevel />
        </TabsContent>
        <TabsContent value="Hourly">
          <HourlyAndDailyWaterLevel />
        </TabsContent>
        <TabsContent value="Daily">
          <HourlyAndDailyWaterLevel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
