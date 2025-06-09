'use client';

import { RoleAuth } from '@rahat-ui/auth';
import { AAImportStakeholders } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={['Admin', 'Manager']}>
      <AAImportStakeholders />;
    </RoleAuth>
  );
};

export default Page;
