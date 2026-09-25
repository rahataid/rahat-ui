'use client';

import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import { ACTIONS, SUBJECTS } from 'apps/rahat-ui/src/constants/ability.constants';
import { BeneficiaryEditView } from 'apps/rahat-ui/src/sections/beneficiary';

const Page = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.UPDATE} subject={SUBJECTS.BENEFICIARY}>
      <BeneficiaryEditView />
    </GlobalPermissionGuard>
  );
};

export default Page;
