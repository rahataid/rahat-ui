'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AAGrievancesView } from 'apps/rahat-ui/src/sections/projects/aa-2/grievances';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.GRIEVANCE}>
      <AAGrievancesView />
    </ProjectPermissionGuard>
  );
};

export default Page;
