'use client';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { DashboardCharts } from '.';
import { mapboxBasicConfig } from '../../constants/config';
import DashboardSummary from './summary';
import { useGetBeneficiaryStats } from '@rahat-ui/query';

export default function DashboardView() {
  const beneficiaryStats = useGetBeneficiaryStats();
  return (
    <div className="bg-secondary">
      <Tabs defaultValue="list">
        <ScrollArea className="h-[calc(100vh-68px)] px-2 py-2">
          <TabsContent value="list">
            <DashboardSummary />
            <DashboardCharts charts={beneficiaryStats.data?.data} />
          </TabsContent>
          <StyledMapContainer>
            <ClusterMap {...mapboxBasicConfig} mapStyle={THEMES.light} />
          </StyledMapContainer>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
