'use client';
import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import { ACTIONS, SUBJECTS } from 'apps/rahat-ui/src/constants/ability.constants';
import { BeneficiaryDetailView } from 'apps/rahat-ui/src/sections/beneficiary';

const Page = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.BENEFICIARY}>
      <BeneficiaryDetailView />
    </GlobalPermissionGuard>
  );
};

export default Page;
