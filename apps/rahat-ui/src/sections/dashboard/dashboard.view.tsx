'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { mapboxBasicConfig } from '../../constants/config';
import { DynamicReports } from '../chart-reports';
import {
  useGetDataSource,
  useProjectAction,
  useProjectList,
} from '@rahat-ui/query';
import { useEffect, useState } from 'react';
import { filterVendorsGeoJson } from '../../utils/getVendorInfo';

export default function DashboardView() {
  const [dataForMap, setDataForMap] = useState<any>();

  const getVendors = useProjectAction();
  const projectsList = useProjectList();
  const project = projectsList?.data?.data.find((item) => item.type === 'el');
  const elUuid = project ? project.uuid : null;

  const fetchVendors = async () => {
    const response = await getVendors.mutateAsync({
      uuid: elUuid as '${string}-${string}-${string}-${string}-${string}',
      data: {
        action: 'elProject.getVendorStats',
        payload: {},
      },
    });
    setDataForMap(filterVendorsGeoJson(response));
  };

  useEffect(() => {
    if (!elUuid) return;
    fetchVendors();
  }, [elUuid]);

  const newDatasource = useGetDataSource();

  return (
    <div className="bg-card p-2 sm:p-4">
      <div className="mb-4">
        <h1 className="font-semibold text-[22px] sm:text-[28px]">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Your Hub for Real-Time Analytics and Data Visualization of the system
        </p>
      </div>

      <Tabs defaultValue="overview">
        {/* Scrollable Tabs for Mobile */}
        <TabsList className="border bg-secondary rounded w-full sm:w-60 overflow-x-auto flex">
          <TabsTrigger
            className="flex-1 data-[state=active]:bg-white px-4"
            value="overview"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 data-[state=active]:bg-white px-4"
            value="graphs"
          >
            Graphs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Dynamic Height for Mobile */}
          <ScrollArea className="h-auto md:h-[calc(100vh-220px)]">
            {newDatasource?.data && newDatasource?.data[0]?.data?.ui.length && (
              <DynamicReports
                className="grid gap-2"
                dataSources={newDatasource?.data[0]?.data?.dataSources}
                ui={newDatasource?.data[0]?.data?.ui}
              />
            )}

            {/* {dataForMap && (
              <StyledMapContainer>
                <ClusterMap
                  {...mapboxBasicConfig}
                  mapStyle={THEMES.light}
                  dataForMap={dataForMap}
                  className="w-full h-[300px] sm:h-[500px]"
                />
              </StyledMapContainer>
            )} */}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="graphs">Graphs</TabsContent>
      </Tabs>
    </div>
  );
}
