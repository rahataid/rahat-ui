'use client';

import { Tabs } from '@rahat-ui/shadcn/components/tabs';
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

export default function DashboardView() {
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
    <div className="bg-secondary">
      <ScrollArea className="h-[calc(100vh-68px)] p-4">
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
    </div>
  );
}
