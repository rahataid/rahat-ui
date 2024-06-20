'use client';

import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { mapboxBasicConfig } from '../../constants/config';
import { DynamicReports, tempReport } from '../chart-reports';

export default function DashboardView() {
  const reportData = [
    {
      name: 'TOTAL_VENDORS',
      data: `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/vendors/stats`,
    },
    {
      name: 'BENEFICIARIES',
      data: `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/beneficiaries/stats`,
    },
  ];
  return (
    <div className="bg-secondary">
      <Tabs defaultValue="list">
        <ScrollArea className="h-[calc(100vh-68px)] px-2 py-2">
          <DynamicReports data={reportData} ui={tempReport?.ui} />

          {/* <TabsContent value="list">
            <DashboardSummary data={data} />
            <DashboardCharts charts={beneficiaryStats?.data?.data} />
          </TabsContent> */}
          <StyledMapContainer>
            <ClusterMap {...mapboxBasicConfig} mapStyle={THEMES.light} />
          </StyledMapContainer>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
