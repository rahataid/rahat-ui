import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

import { useRemoveMonitoring, useSingleMonitoring } from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  DeleteButton,
  EditButton,
  HeaderWithBack,
  NoResult,
} from 'apps/rahat-ui/src/common';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import { UUID } from 'crypto';
import { Calendar, User, Waves } from 'lucide-react';
import { DhmContent } from './dhm/dhm.content';
import FlashFloodRiskMonitoringCard from './flash-flood-risk-monitoring/flash.flood.risk.monitoring.card';
import GLOFASCard from './glofas/glofas.card';
import AccumulatedCard from './ncmrwf/ncmrwf.accumulated.card';
import WeatherDashboard from './ncmrwf/ncmwrf.deterministic.problastic.weatherCard';
import GaugereadingMonitoringCard from './gaugeReading/gaugeReading';

export default function DailyMonitoringDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;

  const { data, isLoading } = useSingleMonitoring(projectId, monitoringId);

  const dataDetails = React.useMemo(() => {
    return data?.data?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data]);

  const DHM_data = React.useMemo(() => {
    if (dataDetails) {
      return dataDetails
        .map((item: any) => {
          const filteredData = item.data.filter((d: any) => d.source === 'DHM');
          return { ...item, data: filteredData };
        })
        .filter((item: any) => item.data.length > 0);
    } else return [];
  }, [dataDetails]);

  const GLOFAS_data = React.useMemo(() => {
    if (dataDetails) {
      return dataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'GLOFAS',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [dataDetails]);

  const NCMRWF_Deterministic_Probabilistic_data = React.useMemo(() => {
    if (dataDetails) {
      return dataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'NCMRWF Deterministic & Probabilistic',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [dataDetails]);

  const NCMRWF_Accumulated_data = React.useMemo(() => {
    if (dataDetails) {
      return dataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'NCMRWF Accumulated',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [dataDetails]);

  const Flash_Flood_Risk_Monitoring_data = React.useMemo(() => {
    if (dataDetails) {
      return dataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'Flash Flood Risk Monitoring',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [dataDetails]);

  const Gauge_Reading_Monitoring_data = React.useMemo(() => {
    if (dataDetails) {
      return dataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'Gauge Reading',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [dataDetails]);

  console.log('gaugeReading', Gauge_Reading_Monitoring_data);

  const dailyMonitoringListPath = `/projects/aa/${projectId}/data-sources/#monitoring`;
  const dailyMonitoringEditPath = `/projects/aa/${projectId}/data-sources/daily-monitoring/${monitoringId}/edit`;

  const deleteMonitoring = useRemoveMonitoring();

  const onDelete = () => {
    deleteMonitoring.mutateAsync({
      projectUUID: projectId,
      monitoringPayload: { uuid: monitoringId },
    });
  };

  React.useEffect(() => {
    deleteMonitoring.isSuccess && router.push(dailyMonitoringListPath);
  }, [deleteMonitoring.isSuccess]);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="p-4">
      <div className=" flex justify-between items-center">
        <HeaderWithBack
          title={'Bulletin Details'}
          subtitle="Detailed view of selected bulletin"
          path={`/projects/aa/${projectId}/data-sources?tab=dailyMonitoring`}
        />
        <div className="flex gap-4 items-center">
          <EditButton path={dailyMonitoringEditPath} />
          <DeleteButton name="project" handleContinueClick={onDelete} />
        </div>
      </div>

      <div className="flex mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-9 border rounded-sm p-5 w-full lg:w-auto">
          <div className="flex items-center gap-3 ">
            <User className="h-5 w-5 text-gray-700" />
            <div>
              <p className="text-md text-gray-700">Recorded by</p>
              <p className="text-muted-foreground text-sm">
                {data?.data?.[0]?.dataEntryBy}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:justify-center ">
            <Waves className="h-5 w-5 text-gray-700" />
            <div>
              <p className="text-md text-gray-700">River Basin</p>
              <p className="text-muted-foreground text-sm">
                {data?.data?.[0]?.riverBasin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ">
            <Calendar className="h-5 w-5 text-gray-700" />
            <div>
              <p className="text-md text-gray-700">Timestamp</p>
              <p className="text-muted-foreground text-sm">
                {Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour12: true,
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(data?.data?.[0]?.createdAt))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dhm" className="items-center">
        <div className=" flex items-center py-2">
          <TabsList className=" gap-4 text-gray-600 border bg-secondary rounded justify-start overflow-x-auto h-auto">
            <TabsTrigger
              value="dhm"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              DHM
            </TabsTrigger>
            <TabsTrigger
              value="glofas"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              GLOFAS
            </TabsTrigger>
            <TabsTrigger
              value="ncmrwf-deterministic"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              NCMRWF Deterministic & Probablistic
            </TabsTrigger>
            <TabsTrigger
              value="ncrmwf-accumulated"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              NCRMWF Accumulated
            </TabsTrigger>
            <TabsTrigger
              value="flash-flood"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              Flash Flood Risk Monitoring
            </TabsTrigger>
            <TabsTrigger
              value="gauge-reading"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              Gauge Reading
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dhm">
          {DHM_data?.length ? (
            <DhmContent data={DHM_data} />
          ) : (
            <NoResult message="No DHM Data" />
          )}
        </TabsContent>
        <TabsContent value="flash-flood">
          {Flash_Flood_Risk_Monitoring_data?.length ? (
            <FlashFloodRiskMonitoringCard
              data={Flash_Flood_Risk_Monitoring_data}
            />
          ) : (
            <NoResult message="No Flash Flood Risk Monitoring Data" />
          )}
        </TabsContent>
        <TabsContent value="ncmrwf-deterministic">
          {NCMRWF_Deterministic_Probabilistic_data?.length ? (
            <WeatherDashboard data={NCMRWF_Deterministic_Probabilistic_data} />
          ) : (
            <NoResult message="No NCMRWF Deterministic & Probablistic Data" />
          )}
        </TabsContent>
        <TabsContent value="ncrmwf-accumulated">
          {NCMRWF_Accumulated_data?.length ? (
            <AccumulatedCard data={NCMRWF_Accumulated_data} />
          ) : (
            <NoResult message="No NCRMWF Accumulated Data" />
          )}
        </TabsContent>

        <TabsContent value="glofas">
          {GLOFAS_data?.length ? (
            <GLOFASCard data={GLOFAS_data} />
          ) : (
            <NoResult message="No GLOFAS Data" />
          )}
        </TabsContent>
        <TabsContent value="gauge-reading">
          {Gauge_Reading_Monitoring_data?.length ? (
            <GaugereadingMonitoringCard data={Gauge_Reading_Monitoring_data} />
          ) : (
            <NoResult message="No Gauge Reading Data" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
