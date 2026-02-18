'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { BeneficiaryTransactionLogDetails } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';
import { AArrowDown } from 'lucide-react';

const Page = () => {
  return (
    <RoleAuth
      roles={[
        AARoles.ADMIN,
        AARoles.MANAGER,
        AARoles.Municipality,
        AARoles.UNICEFNepalCO,
      ]}
    >
      <BeneficiaryTransactionLogDetails />
    </RoleAuth>
  );
};

export default Page;
