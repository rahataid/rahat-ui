'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AAFundManagementView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.READ}
      subject={SUBJECTS.FUND_MANAGEMENT}
    >
      <AAFundManagementView />
    </ProjectPermissionGuard>
  );
};

export default Page;
