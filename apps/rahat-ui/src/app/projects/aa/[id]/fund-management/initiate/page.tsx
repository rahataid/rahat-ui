'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import InitiateFundTransfer from 'apps/rahat-ui/src/sections/projects/aa-2/fundManagement/components/cashTracker/initiate.fund.transfer';

const AddFundManagement = () => {
  return (
    <RoleAuth
      roles={[
        AARoles.ADMIN,
        AARoles.UNICEF_DONOR,
        AARoles.UNICEF_FIELD_OFFICE,
        AARoles.UNICEF_HEAD_OFFICE,
      ]}
    >
      <InitiateFundTransfer />
    </RoleAuth>
  );
};

export default AddFundManagement;
