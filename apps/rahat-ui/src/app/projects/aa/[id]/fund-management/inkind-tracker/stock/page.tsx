'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import Stock from 'apps/rahat-ui/src/sections/projects/aa-2/fundManagement/components/inKindTracker/stock';

const StockPage = () => {
  return (
    <RoleAuth roles={[AARoles.UNICEFNepalCO]}>
      <Stock />
    </RoleAuth>
  );
};

export default StockPage;
