'use client';

import { AAProjectSettingsView } from 'apps/rahat-ui/src/sections/projects/aa-2/settings';
import { ProjectPermissionGuard } from 'apps/rahat-ui/src/guards/project-permission-guard';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.MANAGE} subject={SUBJECTS.ALL}>
      <AAProjectSettingsView />
    </ProjectPermissionGuard>
  );
};

export default Page;
