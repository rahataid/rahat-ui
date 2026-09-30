'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { ActivitiesList } from 'apps/rahat-ui/src/sections/projects/aa-2/activities';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.ACTIVITY}>
      <ActivitiesList />
    </ProjectPermissionGuard>
  );
};

export default Page;
