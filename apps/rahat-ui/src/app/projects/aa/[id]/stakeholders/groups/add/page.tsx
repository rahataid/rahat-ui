'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AAUpdateOrAddStakeholdersGroup } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.CREATE}
      subject={SUBJECTS.STAKEHOLDER}
    >
      <AAUpdateOrAddStakeholdersGroup />
    </ProjectPermissionGuard>
  );
};

export default Page;
