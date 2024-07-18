import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Back from '../../../../components/back';
import EditButton from '../../../../components/edit.btn';
import DeleteButton from '../../../../components/delete.btn';
import DetailsHeadCard from '../../../../components/details.head.card';
import { User, Waves } from 'lucide-react';
import { UUID } from 'crypto';
import { useRemoveMonitoring, useSingleMonitoring } from '@rahat-ui/query';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import DHMCard from './dhm/dhm.card';
import GLOFASCard from './glofas/glofas.card';
import DeterministicAndProbabilisticCard from './ncmrwf/ncmrwf.deterministic.probabilistic.card';
import AccumulatedCard from './ncmrwf/ncmrwf.accumulated.card';
import FlashFloodRiskMonitoringCard from './flash-flood-risk-monitoring/flash.flood.risk.monitoring.card';

export default function DailyMonitoringDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;

  const { data, isLoading } = useSingleMonitoring(projectId, monitoringId);

  const latestDataDetails = React.useMemo(() => {
    return data?.data?.singleData;
  }, [data]);

  const multipleDataDetails = React.useMemo(() => {
    return data?.data?.multipleData?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data]);

  const DHM_data = React.useMemo(() => {
    if (multipleDataDetails) {
      return multipleDataDetails
        .map((item: any) => {
          const filteredData = item.data.filter((d: any) => d.source === 'DHM');
          return { ...item, data: filteredData };
        })
        .filter((item: any) => item.data.length > 0);
    } else return [];
  }, [multipleDataDetails]);

  const GLOFAS_data = React.useMemo(() => {
    if (multipleDataDetails) {
      return multipleDataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'GLOFAS',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [multipleDataDetails]);

  const NCMRWF_Deterministic_Probabilistic_data = React.useMemo(() => {
    if (multipleDataDetails) {
      return multipleDataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'NCMRWF Deterministic & Probabilistic',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [multipleDataDetails]);

  const NCMRWF_Accumulated_data = React.useMemo(() => {
    if (multipleDataDetails) {
      return multipleDataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'NCMRWF Accumulated',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [multipleDataDetails]);

  const Flash_Flood_Risk_Monitoring_data = React.useMemo(() => {
    if (multipleDataDetails) {
      return multipleDataDetails
        .map((item: any) => {
          const filteredData = item.data.filter(
            (d: any) => d.source === 'Flash Flood Risk Monitoring',
          );
          return { ...item, data: filteredData[0] };
        })
        .filter((item: any) => item.data);
    } else return [];
  }, [multipleDataDetails]);

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
    <div className="h-[calc(100vh-65px)] bg-secondary p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Back path={dailyMonitoringListPath.concat('?backFromDetail=true')} />
          <h1 className="font-semibold text-xl">Bulletin Details</h1>
        </div>
        <div className="flex gap-4 items-center">
          <EditButton path={dailyMonitoringEditPath} />
          <DeleteButton name="project" handleContinueClick={onDelete} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DetailsHeadCard
          title="Created By"
          icon={<User size={20} />}
          content={latestDataDetails?.dataEntryBy || '-'}
        />
        <DetailsHeadCard
          title="River Basin"
          icon={<Waves size={20} />}
          content={latestDataDetails?.location || '-'}
        />
      </div>
      <div className="p-4 bg-card rounded">
        <Tabs defaultValue="DHM">
          <TabsList className="gap-4 mt-4 mb-2">
            <TabsTrigger
              value="DHM"
              className="px-6 border bg-card data-[state=active]:border-primary"
            >
              DHM
            </TabsTrigger>

            <TabsTrigger
              value="GLOFAS"
              className="px-6 border bg-card data-[state=active]:border-primary"
            >
              GLOFAS
            </TabsTrigger>

            <TabsTrigger
              value="NCMRWF Deterministic & Probabilistic"
              className="px-6 border bg-card data-[state=active]:border-primary"
            >
              NCMRWF Deterministic & Probabilistic
            </TabsTrigger>

            <TabsTrigger
              value="NCMRWF Accumulated"
              className="px-6 border bg-card data-[state=active]:border-primary"
            >
              NCMRWF Accumulated
            </TabsTrigger>

            <TabsTrigger
              value="Flash Flood Risk Monitoring"
              className="px-6 border bg-card data-[state=active]:border-primary"
            >
              Flash Flood Risk Monitoring
            </TabsTrigger>
          </TabsList>
          <TabsContent value="DHM">
            {DHM_data?.length ? <DHMCard data={DHM_data} /> : 'No Data'}
          </TabsContent>

          <TabsContent value="GLOFAS">
            {GLOFAS_data?.length ? (
              <GLOFASCard data={GLOFAS_data} />
            ) : (
              'No Data'
            )}
          </TabsContent>

          <TabsContent value="NCMRWF Deterministic & Probabilistic">
            {NCMRWF_Deterministic_Probabilistic_data?.length ? (
              <DeterministicAndProbabilisticCard
                data={NCMRWF_Deterministic_Probabilistic_data}
              />
            ) : (
              'No Data'
            )}
          </TabsContent>

          <TabsContent value="NCMRWF Accumulated">
            {NCMRWF_Accumulated_data?.length ? (
              <AccumulatedCard data={NCMRWF_Accumulated_data} />
            ) : (
              'No Data'
            )}
          </TabsContent>

          <TabsContent value="Flash Flood Risk Monitoring">
            {Flash_Flood_Risk_Monitoring_data?.length ? (
              <FlashFloodRiskMonitoringCard
                data={Flash_Flood_Risk_Monitoring_data}
              />
            ) : (
              'No Data'
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
