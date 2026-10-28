'use client';

import { ProjectPermissionGuard } from 'apps/rahat-ui/src/guards/project-permission-guard';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { AAUpdateStatus } from 'apps/rahat-ui/src/sections/projects/aa-2/activities';

const Page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.UPDATE}
      subject={SUBJECTS.ACTIVITY}
    >
      <AAUpdateStatus />
    </ProjectPermissionGuard>
  );
};

export default Page;