import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import { ACTIONS, SUBJECTS } from 'apps/rahat-ui/src/constants/ability.constants';
import { AddView } from 'apps/rahat-ui/src/sections/beneficiary/add';
import React from 'react';

const AddBeneficiaryPage = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.BENEFICIARY}>
      <AddView />
    </GlobalPermissionGuard>
  );
};

export default AddBeneficiaryPage;
