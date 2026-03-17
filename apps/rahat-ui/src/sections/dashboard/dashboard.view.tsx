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
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-semibold text-2xl sm:text-3xl tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Your Hub for Real-Time Analytics and Data Visualization of the system
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-muted rounded-lg w-full sm:w-auto inline-flex p-1">
          <TabsTrigger
            className="flex-1 sm:flex-none rounded-md px-6 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            value="overview"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 sm:flex-none rounded-md px-6 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            value="graphs"
          >
            Graphs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <ScrollArea className="h-auto md:h-[calc(100vh-220px)]">
            {newDatasource?.data && newDatasource?.data[0]?.data?.ui.length && (
              <DynamicReports
                className="grid gap-4"
                dataSources={newDatasource?.data[0]?.data?.dataSources}
                ui={newDatasource?.data[0]?.data?.ui}
              />
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="graphs" className="mt-4">
          <div className="flex items-center justify-center h-48 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
            Graphs will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
