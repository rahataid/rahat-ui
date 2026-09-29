'use client';

import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import { ACTIONS, SUBJECTS } from 'apps/rahat-ui/src/constants/ability.constants';
import { BeneficiaryAddGroupView } from 'apps/rahat-ui/src/sections/beneficiary';

const Page = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.BENEFICIARY}>
      <BeneficiaryAddGroupView />
    </GlobalPermissionGuard>
  );
};

export default Page;
