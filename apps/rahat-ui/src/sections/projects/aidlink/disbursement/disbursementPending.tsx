import { useGetDisbursements } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { DisbursementList } from './disbursementList';

export function DisbursementPendingList() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const { data: disbursements, isLoading } = useGetDisbursements({
    projectUUID,
    page: 1,
    perPage: 10,
  });

  return <DisbursementList disbursements={disbursements} loading={isLoading} />;
}
