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

  console.log('DD=>', data?.data);

  const totalBenef =
    data?.data.find((f) => f.name === 'BENEFICIARY_TOTAL') || ([] as any);
  console.log('totalBenef', totalBenef);

  // const totalBeneficiaries = data?.data
  //   ?.filter((name) => name.name === 'BENEFICIARY_TOTAL')
  //   .map((item) => (item && item.data ? item.data.count[0] : 0));

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
