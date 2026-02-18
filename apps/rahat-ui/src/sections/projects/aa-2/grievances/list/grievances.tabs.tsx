import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import GrievanceOverview from './grievances.overview';
import GrievancesTable from './grievances.table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';

export default function GrievancesTabs() {
  const { closeSecondPanel } = useSecondPanel();
  const { activeTab, setActiveTab } = useActiveTab('overview');

  const handleTabChange = (value: string) => {
    if (value === 'overview') {
      closeSecondPanel();
    }
    setActiveTab(value);
  };

  return (
    <div>
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="border bg-secondary rounded pb-2">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="overview"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="list"
          >
            Grievance List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <GrievanceOverview />
        </TabsContent>
        <TabsContent value="list">
          <GrievancesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
