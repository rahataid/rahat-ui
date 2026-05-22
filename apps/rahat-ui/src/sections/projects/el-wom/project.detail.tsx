import { useGetProjectDatasource } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import DynamicReports from './sms-voucher-dynamic-reports';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { ReferralsSection } from './referrals';

export default function ProjectDetail() {
  const { id } = useParams() as { id: UUID };
  const { data: newDatasource, isLoading } = useGetProjectDatasource(id);

  return isLoading ? (
    <TableLoader />
  ) : (
    <div className="space-y-6">
      <ReferralsSection projectUUID={id} />
      {/* {newDatasource && newDatasource[0]?.data?.ui.length && (
        <DynamicReports
          dataSources={newDatasource[0]?.data?.dataSources}
          ui={newDatasource[0]?.data?.ui}
        />
      )} */}
    </div>
  );
}
