'use client';

import { useCommunityBeneficiaryStatsList } from '@rahat-ui/community-query';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { DashboardCharts } from '.';
import DashboardSummary from './summary';

export default function DashboardView() {
  const { data } = useCommunityBeneficiaryStatsList();

  const totalBenef =
    data?.data.find((f) => f.name === 'BENEFICIARY_TOTAL') || ([] as any);
  console.log('totalBenef', totalBenef);

  return (
    <div>
      <Tabs defaultValue="list">
        <ScrollArea className="h-[calc(100vh-68px)] px-4 py-2">
          <TabsContent value="list">
            <DashboardSummary totalBeneficiaries={totalBenef?.data?.count} />
            <DashboardCharts charts={data?.data} />
          </TabsContent>
          {/* <StyledMapContainer>
            <ClusterMap {...mapboxBasicConfig} mapStyle={THEMES.light} />
          </StyledMapContainer> */}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
