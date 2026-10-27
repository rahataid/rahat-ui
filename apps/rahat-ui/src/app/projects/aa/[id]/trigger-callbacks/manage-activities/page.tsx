'use client';

import dynamic from 'next/dynamic';
import { ProjectPermissionGuard } from 'apps/rahat-ui/src/guards/project-permission-guard';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

const ManageTriggerActivityCallbackPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AAManageTriggerActivityCallbackView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard action={ACTIONS.UPDATE} subject={SUBJECTS.TRIGGER}>
      <ManageTriggerActivityCallbackPage />
    </ProjectPermissionGuard>
  );
}
