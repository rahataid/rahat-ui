'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { VerificationPayout } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.UPDATE} subject={SUBJECTS.PAYOUT}>
      <VerificationPayout />
    </ProjectPermissionGuard>
  );
};

export default Page;
