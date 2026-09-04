'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AAFundManagementDetailView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.READ}
      subject={SUBJECTS.FUND_MANAGEMENT}
    >
      <AAFundManagementDetailView />
    </ProjectPermissionGuard>
  );
};

export default Page;
