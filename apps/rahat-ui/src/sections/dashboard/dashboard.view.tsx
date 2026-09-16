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
import { DynamicReports, tempReport } from '../chart-reports';
import {
  useGetDataSource,
  useGetProjectDatasource,
  useProjectAction,
  useProjectList,
} from '@rahat-ui/query';
import { useEffect, useState } from 'react';
import { filterVendorsGeoJson } from '../../utils/getVendorInfo';
import { useTranslations } from 'next-intl';

export default function DashboardView() {
  const t = useTranslations('DASHBOARD');
  const g = useTranslations('GLOBAL');
  const reportData = [
    {
      name: 'BENEFICIARIES',
      data: `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/beneficiaries/stats`,
    },
  ];

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
    <div className="bg-card p-4">
      <div className="mb-4">
        <h1 className="font-semibold text-[28px]">{g('DASHBOARD')}</h1>
        <p className="text-muted-foreground text-base">
          {t('YOUR_HUB_FOR_REAL_TIME_ANALYTICS')}
        </p>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="border bg-secondary rounded w-60">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="overview"
          >
            {t('OVERVIEW')}
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="graphs"
          >
            {t('GRAPHS')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ScrollArea className="p-4 h-[calc(100vh-220px)]">
            {newDatasource?.data && newDatasource?.data[0]?.data?.ui.length && (
              <DynamicReports
                className="grid gap-2"
                dataSources={newDatasource?.data[0]?.data?.dataSources}
                ui={newDatasource?.data[0]?.data?.ui}
              />
            )}
            {dataForMap && (
              <StyledMapContainer>
                <ClusterMap
                  {...mapboxBasicConfig}
                  mapStyle={THEMES.light}
                  dataForMap={dataForMap}
                />
              </StyledMapContainer>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="graphs">{t('GRAPHS')}</TabsContent>
      </Tabs>
    </div>
  );
}
