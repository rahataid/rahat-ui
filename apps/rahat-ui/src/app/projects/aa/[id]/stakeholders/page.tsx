'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AAStakeholdersView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.STAKEHOLDER}>
      <AAStakeholdersView />
    </ProjectPermissionGuard>
  );
};

export default Page;
