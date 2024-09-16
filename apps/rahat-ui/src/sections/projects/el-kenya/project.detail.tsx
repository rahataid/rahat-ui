import { useGetProjectDatasource } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { DynamicReports } from '../../chart-reports';

export default function ProjectDetail() {
  const { id } = useParams() as { id: UUID };
  const newDatasource = useGetProjectDatasource(id);

  return (
    <>
      {newDatasource?.data && newDatasource?.data[0]?.data?.ui.length && (
        <DynamicReports
          dataSources={newDatasource?.data[0]?.data?.dataSources}
          ui={newDatasource?.data[0]?.data?.ui}
        />
      )}
    </>
  );
}
