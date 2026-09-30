'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AAStakeholdersGroupsDetails } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.READ}
      subject={SUBJECTS.STAKEHOLDER}
    >
      <AAStakeholdersGroupsDetails />
    </ProjectPermissionGuard>
  );
};

export default Page;
