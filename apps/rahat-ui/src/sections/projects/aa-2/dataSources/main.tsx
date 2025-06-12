import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import { DHMSection, GlofasSection } from './components';
import { DailyMonitoringListView } from './components/dailyMonitoring';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';

export default function DataSources() {
  const { activeTab, setActiveTab } = useActiveTab('dhm');

  return (
    <div className="p-4">
      <Heading
        title="Forecast Data"
        description="Track all the data sources reports here"
      />
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border bg-secondary rounded mb-2">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
            value="dhm"
          >
            DHM
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
            value="glofas"
          >
            GLOFAS
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
            value="dailyMonitoring"
          >
            Daily Monitoring
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dhm">
          <DHMSection />
        </TabsContent>
        <TabsContent value="glofas">
          <GlofasSection />
        </TabsContent>
        <TabsContent value="dailyMonitoring">
          <DailyMonitoringListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
