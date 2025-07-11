'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { BeneficiaryTransactionLogDetails } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <BeneficiaryTransactionLogDetails />
    </RoleAuth>
  );
};

export default Page;
