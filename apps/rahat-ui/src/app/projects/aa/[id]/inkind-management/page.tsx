'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import InKindManagementView from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/main';
import React from 'react';

const page = () => {
  return (
    <RoleAuth
      roles={[AARoles.UNICEFNepalCO, AARoles.Municipality, AARoles.ADMIN]}
    >
      <InKindManagementView />
    </RoleAuth>
  );
};

export default page;
