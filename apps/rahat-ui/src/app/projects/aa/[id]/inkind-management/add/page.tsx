'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import AddInkindView from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/add.inkind';

const AddInkindPage = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.INKIND}>
      <AddInkindView />
    </ProjectPermissionGuard>
  );
};

export default AddInkindPage;
