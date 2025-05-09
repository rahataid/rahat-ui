import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import { DHMSection } from './components';
import { DailyMonitoringListView } from './components/dailyMonitoring';

export default function DataSources() {
  return (
    <div className="p-4">
      <Heading
        title="Forecast Data"
        description="Trach all the data sources reports here"
      />
      <Tabs defaultValue="DHM">
        <TabsList className="border bg-secondary rounded mb-2">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
            value="DHM"
          >
            DHM
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
            value="Daily Monitoring"
          >
            Daily Monitoring
          </TabsTrigger>
        </TabsList>
        <TabsContent value="DHM">
          <DHMSection />
        </TabsContent>
        <TabsContent value="Daily Monitoring">
          <DailyMonitoringListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
