'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import InitiateInKindTransfer from 'apps/rahat-ui/src/sections/projects/aa-2/fundManagement/components/inKindTracker/initiate.inkind.transfer';

const InitiateInKindTransferPage = () => {
  return (
    <RoleAuth roles={[AARoles.UNICEFNepalCO, AARoles.Municipality]}>
      <InitiateInKindTransfer />
    </RoleAuth>
  );
};

export default InitiateInKindTransferPage;
