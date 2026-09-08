'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import InKindManagementView from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/main';
import React from 'react';

const page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.INKIND}>
      <InKindManagementView />
    </ProjectPermissionGuard>
  );
};

export default page;
