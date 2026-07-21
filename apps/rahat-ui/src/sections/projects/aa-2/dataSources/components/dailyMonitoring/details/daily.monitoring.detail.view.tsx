import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

import {
  useProjectInfo,
  useRemoveMonitoring,
  useSingleMonitoring,
} from '@rahat-ui/query';
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
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';
import { useTranslations } from 'next-intl';

export default function DailyMonitoringDetailView() {
  const t = useTranslations('AA Project');
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;

  const { data: projectInfo } = useProjectInfo(projectId as UUID);
  const stationHeading = getStationTitle(
    projectInfo?.value?.project_type || '',
  );
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
          title={t('BULLETIN_DETAILS')}
          subtitle={t('DETAILED_VIEW_OF_SELECTED_BULLETIN')}
          path={`/projects/aa/${projectId}/data-sources?tab=dailyMonitoring`}
        />
        <div className="flex gap-4 items-center">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <EditButton path={dailyMonitoringEditPath} />
          </RoleAuth>
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <DeleteButton name="project" handleContinueClick={onDelete} />
          </RoleAuth>
        </div>
      </div>

      <div className="flex mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-9 border rounded-sm p-5 w-full lg:w-auto">
          <div className="flex items-center gap-3 ">
            <User className="h-5 w-5 text-gray-700" />
            <div>
              <p className="text-md text-gray-700">{t('RECORDED_BY')}</p>
              <p className="text-muted-foreground text-sm">
                {data?.data?.[0]?.dataEntryBy}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:justify-center ">
            <Waves className="h-5 w-5 text-gray-700" />
            <div>
              <p className="text-md text-gray-700">{stationHeading}</p>
              <p className="text-muted-foreground text-sm">
                {data?.data?.[0]?.riverBasin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ">
            <Calendar className="h-5 w-5 text-gray-700" />
            <div>
              <p className="text-md text-gray-700">{t('TIMESTAMP')}</p>
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

      <Tabs defaultValue={t('DHM')} className="items-center">
        <div className=" flex items-center py-2">
          <TabsList className=" gap-4 text-gray-600 border bg-secondary rounded justify-start overflow-x-auto h-auto">
            <TabsTrigger
              value={t('DHM')}
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
              {t('NCMRWF_DETERMINISTIC_PROBABLISTIC')}
            </TabsTrigger>
            <TabsTrigger
              value="ncrmwf-accumulated"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              {t('NCRMWF_ACCUMULATED')}
            </TabsTrigger>
            <TabsTrigger
              value="flash-flood"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              {t('FLASH_FLOOD_RISK_MONITORING')}
            </TabsTrigger>
            <TabsTrigger
              value="gauge-reading"
              className=" data-[state=active]:bg-white  data-[state=active]:text-gray-600"
            >
              {t('GAUGE_READING')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={t('DHM')}>
          {DHM_data?.length ? (
            <DhmContent data={DHM_data} />
          ) : (
            <NoResult message={t('NO_DHM_DATA')} />
          )}
        </TabsContent>
        <TabsContent value="flash-flood">
          {Flash_Flood_Risk_Monitoring_data?.length ? (
            <FlashFloodRiskMonitoringCard
              data={Flash_Flood_Risk_Monitoring_data}
            />
          ) : (
            <NoResult message={t('NO_FLASH_FLOOD_RISK_MONITORING_DATA')} />
          )}
        </TabsContent>
        <TabsContent value="ncmrwf-deterministic">
          {NCMRWF_Deterministic_Probabilistic_data?.length ? (
            <WeatherDashboard data={NCMRWF_Deterministic_Probabilistic_data} />
          ) : (
            <NoResult message={t('NO_NCMRWF_DETERMINISTIC_DATA')} />
          )}
        </TabsContent>
        <TabsContent value="ncrmwf-accumulated">
          {NCMRWF_Accumulated_data?.length ? (
            <AccumulatedCard data={NCMRWF_Accumulated_data} />
          ) : (
            <NoResult message={t('NO_NCRMWF_ACCUMULATED_DATA')} />
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
            <NoResult message={t('NO_GAUGE_READING_DATA')} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
