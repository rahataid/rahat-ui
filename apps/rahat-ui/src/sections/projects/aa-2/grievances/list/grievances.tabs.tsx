import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import GrievanceOverview from './grievances.overview';
import GrievancesTable from './grievances.table';

export default function GrievancesTabs() {
  const { activeTab, setActiveTab } = useActiveTab('overview');
  return (
    <div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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
