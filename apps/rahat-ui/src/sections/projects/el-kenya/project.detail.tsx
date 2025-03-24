import { useGetProjectDatasource } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { DynamicReports } from '../../chart-reports';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

export default function ProjectDetail() {
  const { id } = useParams() as { id: UUID };
  const { data: newDatasource, isLoading } = useGetProjectDatasource(id);

  return isLoading ? (
    <TableLoader />
  ) : (
    <>
      {newDatasource && newDatasource[0]?.data?.ui.length && (
        <DynamicReports
          dataSources={newDatasource[0]?.data?.dataSources}
          ui={newDatasource[0]?.data?.ui}
        />
      )}
    </>
  );
}
