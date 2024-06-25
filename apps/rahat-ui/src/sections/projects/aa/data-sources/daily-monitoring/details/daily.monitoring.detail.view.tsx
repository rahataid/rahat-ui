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

export default function DailyMonitoringDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;

  const { data, isLoading } = useSingleMonitoring(projectId, monitoringId);
  const details = React.useMemo(() => {
    return data?.data;
  }, [data]);

  const DHM_data = React.useMemo(() => {
    if (details) {
      return details?.monitoringData?.filter((d: any) => d.source === 'DHM');
    } else return [];
  }, [details]);

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
          <Back path={dailyMonitoringListPath} />
          <h1 className="font-semibold text-xl">Bulletin Details</h1>
        </div>
        <div className="flex gap-4 items-center">
          <EditButton path={dailyMonitoringEditPath} />
          <DeleteButton name="project" handleContinueClick={onDelete} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DetailsHeadCard
          title="Data Entry By"
          icon={<User size={20} />}
          content={details?.dataEntryBy || '-'}
        />
        <DetailsHeadCard
          title="River Basin"
          icon={<Waves size={20} />}
          content={details?.location || '-'}
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
            {DHM_data.length ? <DHMCard data={DHM_data} /> : 'No Data'}
          </TabsContent>

          <TabsContent value="GLOFAS">GLOFAS</TabsContent>

          <TabsContent value="NCMRWF Deterministic & Probabilistic">
            NCMRWF Deterministic & Probabilistic
          </TabsContent>

          <TabsContent value="NCMRWF Accumulated">
            NCMRWF Accumulated
          </TabsContent>

          <TabsContent value="Flash Flood Risk Monitoring">
            Flash Flood Risk Monitoring
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
