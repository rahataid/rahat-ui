import React from 'react';
import BeneficiaryInfo from './beneficiary.info';
import TransactionLogs from './transaction.log';
import { useTranslations } from 'next-intl';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useParams, useSearchParams } from 'next/navigation';
import { useProjectBeneficiaryDetail } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { getBeneficiaryRedirectRoute } from 'apps/rahat-ui/src/utils/navigation';

const BeneficiaryDetail = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;
  const searchParams = useSearchParams();
  const t = useTranslations('AA_PROJECT');
  const redirectTo = searchParams.get('groupId') as string;
  const redirectToFund = searchParams.get('fundId') as string;
  const vendorId = searchParams.get('vendorId') as string;
  const tab = searchParams.get('tab') as string;
  const subTab = searchParams.get('subTab') as string;
  const pagination = searchParams.get('pagination') as string;
  const { data: details } = useProjectBeneficiaryDetail({
    projectUUID: projectId,
    uuid: beneficiaryId,
  });

  const navRoute = getBeneficiaryRedirectRoute(projectId, {
    redirectTo,
    redirectToFund,
    vendorId,
    tab,
    subTab,
    pagination,
  });

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={t('BENEFICIARY_DETAILS')}
          subtitle={t('DETAILED_VIEW_OF_THE_SELECTED_BENEFICIARY')}
          path={navRoute}
        />
      </div>

      <div className="flex">
        <div className="flex border rounded-xl flex-col gap-4 p-4 mx-4  w-full">
          <BeneficiaryInfo beneficiary={details} />
        </div>

        <div className="flex border flex-col rounded-xl  gap-4 p-4 mx-4  w-full ">
          <TransactionLogs />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;
