'use client';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { mapboxBasicConfig } from '../../constants/config';
import DashboardSummary from './summary';
import { useCommunityBeneficiaryStatsList } from '@rahat-ui/community-query';
import { DashboardCharts } from '.';

export default function DashboardView() {
  const { data } = useCommunityBeneficiaryStatsList();

  const totalBeneficiaries = data?.data
    ?.filter((name) => name.name === 'BENEFICIARY_TOTAL')
    .map((item) => item.data)[0].count;
  console.log(totalBeneficiaries);
  return (
    <div>
      <Tabs defaultValue="list">
        <ScrollArea className="h-[calc(100vh-68px)] px-4 py-2">
          <TabsContent value="list">
            <DashboardSummary totalBeneficiaries={totalBeneficiaries} />
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
