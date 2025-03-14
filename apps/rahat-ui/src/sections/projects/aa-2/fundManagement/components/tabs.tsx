import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import FundManagementList from '../tables/fm.table';
import TokensOverview from './token.overview';

export default function FundManagementTabs() {
  return (
    <div className="rounded-md p-4 border">
      <Tabs defaultValue="tokenOverview">
        <TabsList className="border bg-secondary rounded mb-2">
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
