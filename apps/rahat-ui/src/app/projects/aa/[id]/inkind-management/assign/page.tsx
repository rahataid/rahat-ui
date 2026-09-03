'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import AssignInkindView from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/assign.inkind';

const AssignInkindPage = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.INKIND}>
      <AssignInkindView />
    </ProjectPermissionGuard>
  );
};

export default AssignInkindPage;
