import React from 'react';
import BeneficiaryInfo from './grievances.info';
import TransactionLogs from './transaction.log';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useParams, useSearchParams } from 'next/navigation';
import { useProjectBeneficiaryDetail } from '@rahat-ui/query';
import { UUID } from 'crypto';

const BeneficiaryDetail = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('groupId');
  const redirectToFund = searchParams.get('fundId');
  const details = useProjectBeneficiaryDetail({
    projectUUID: projectId,
    uuid: beneficiaryId,
  });
  const navRoute = redirectTo
    ? `/projects/aa/${projectId}/beneficiary/groupDetails/${redirectTo}`
    : redirectToFund
    ? `/projects/aa/${projectId}/fund-management/${redirectToFund}`
    : `/projects/aa/${projectId}/beneficiary`;

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={'Beneficiary Details'}
          subtitle="Detailed view of the selected beneficiary"
          path={navRoute}
        />
      </div>

      <div className="flex">
        <div className="flex border rounded-lg flex-col gap-4 p-4 mx-4  w-full">
          <BeneficiaryInfo beneficiary={details} />
        </div>

        <div className="flex border flex-col rounded-lg  gap-4 p-4 mx-4  w-full ">
          <TransactionLogs />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;
