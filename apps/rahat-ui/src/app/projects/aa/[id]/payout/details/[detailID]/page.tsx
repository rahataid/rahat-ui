'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { BeneficiaryGroupTransactionDetailsList } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';

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
      <BeneficiaryGroupTransactionDetailsList />
    </RoleAuth>
  );
};

export default Page;
