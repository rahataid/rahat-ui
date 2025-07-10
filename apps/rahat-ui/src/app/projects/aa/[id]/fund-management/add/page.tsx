'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { AAAssignFundsView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const AddFundManagement = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN]}>
      <AAAssignFundsView />
    </RoleAuth>
  );
};

export default AddFundManagement;
