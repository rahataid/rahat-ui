'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { InkindAllocationDetail } from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/components';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.INKIND}>
      <InkindAllocationDetail />
    </ProjectPermissionGuard>
  );
};

export default Page;
