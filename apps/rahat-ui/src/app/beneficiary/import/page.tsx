import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import { ACTIONS, SUBJECTS } from 'apps/rahat-ui/src/constants/ability.constants';
import { ImportBeneficiaryView } from 'apps/rahat-ui/src/sections/beneficiary/import';
import React from 'react';

const ImportBeneficiary = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.BENEFICIARY}>
      <ImportBeneficiaryView />
    </GlobalPermissionGuard>
  );
};

export default ImportBeneficiary;
