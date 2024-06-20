import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Back from '../../../../components/back';
import EditButton from '../../../../components/edit.btn';
import DeleteButton from '../../../../components/delete.btn';
import DetailsHeadCard from '../../../../components/details.head.card';
import { Calendar, Info } from 'lucide-react';
import { UUID } from 'crypto';
import { useRemoveMonitoring, useSingleMonitoring } from '@rahat-ui/query';
import Loader from 'apps/rahat-ui/src/components/table.loader';

export default function DailyMonitoringDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;

  const { data, isLoading } = useSingleMonitoring(projectId, monitoringId);
  const details = data?.data;

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
      <div className="flex gap-4 items-center mb-4">
        <DetailsHeadCard
          title="Forecast"
          content={details?.forecast}
          icon={<Info size={20} />}
        />
        {details?.source === 'DHM' && (
          <>
            <DetailsHeadCard
              title="Today"
              content={details?.todayStatus ?? 'N/A'}
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="Tomorrow"
              content={details?.tomorrowStatus ?? 'N/A'}
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="Day after tomorrow"
              content={details?.dayAfterTomorrowStatus ?? 'N/A'}
              icon={<Calendar size={20} />}
            />
          </>
        )}
        {details?.source === 'NCMWRF' && (
          <>
            <DetailsHeadCard
              title="24 hours"
              content={details?.hours24Status ?? 'N/A'}
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="48 hours"
              content={details?.hours48Status ?? 'N/A'}
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="72 hours"
              content={details?.hours72Status ?? 'N/A'}
              icon={<Calendar size={20} />}
            />
          </>
        )}
      </div>
      <div className="bg-card p-4 grid grid-cols-2 w-1/2 gap-4">
        <div>
          <h1 className="text-muted-foreground text-sm">Data Entry By</h1>
          <p>{details?.dataEntryBy}</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">River Basin</h1>
          <p>{details?.location}</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Source</h1>
          <p>{details?.source}</p>
        </div>
      </div>
    </div>
  );
}
