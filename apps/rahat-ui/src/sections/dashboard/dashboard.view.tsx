'use client';

import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { mapboxBasicConfig } from '../../constants/config';
import { DynamicReports, tempReport } from '../chart-reports';
import { useProjectAction } from '@rahat-ui/query';
import { useEffect, useState } from 'react';
import { filterVendorsGeoJson, projectUUID } from '../../utils/getVendorInfo';

export default function DashboardView() {
  const reportData = [
    {
      name: 'BENEFICIARIES',
      data: `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/beneficiaries/stats`,
    }
  ];

  const [dataForMap, setDataForMap] = useState<any>()

  const getVendors = useProjectAction();

  const fetchVendors = async () => {
    const response = await getVendors.mutateAsync({
      uuid: projectUUID,
      data: {
        action: "elProject.getVendorStats",
        payload: {},
      },
    });
    console.log("The response of map is", response)
    setDataForMap(filterVendorsGeoJson(response))
  }

  useEffect(() => {
    fetchVendors()
  }, [])


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
            <ClusterMap {...mapboxBasicConfig} mapStyle={THEMES.light} dataForMap={dataForMap}/>
          </StyledMapContainer>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
