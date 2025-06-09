'use client';

import { RoleAuth } from '@rahat-ui/auth';
import { AAAddStakeholders } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={['Admin', 'Manager']}>
      <AAAddStakeholders />;
    </RoleAuth>
  );
};

export default Page;
