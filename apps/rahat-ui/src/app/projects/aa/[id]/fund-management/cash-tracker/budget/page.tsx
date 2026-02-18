'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import Budget from 'apps/rahat-ui/src/sections/projects/aa-2/fundManagement/components/cashTracker/budget';

const BudgetPage = () => {
  return (
    <RoleAuth roles={[AARoles.UNICEFNepalCO]}>
      <Budget />
    </RoleAuth>
  );
};

export default BudgetPage;
