import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import FundManagementList from '../tables/fm.table';
import TokensOverview from './token.overview';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { CashTracker } from './cashTracker/cash.tracker';

export default function FundManagementTabs() {
  const { activeTab, setActiveTab } = useActiveTab('cashTracker');
  return (
    <div className="rounded-md p-4 border">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="cashTracker"
          >
            Cash Tracker
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="tokenOverview"
          >
            Tokens Overview
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="fundManagementList"
          >
            Fund Management List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cashTracker">
          <CashTracker />
        </TabsContent>
        <TabsContent value="tokenOverview">
          <TokensOverview />
        </TabsContent>
        <TabsContent value="fundManagementList">
          <FundManagementList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
