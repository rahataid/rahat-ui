'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import Auth from 'apps/rahat-ui/src/components/Auth';
import { useAbility } from 'apps/rahat-ui/src/context/AbilityContext';
import { AAAssignFundsView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const AddFundManagement = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
      <Auth I="create" a="FundManagement">
        <AAAssignFundsView />
      </Auth>
    </RoleAuth>
  );
};

export default AddFundManagement;
