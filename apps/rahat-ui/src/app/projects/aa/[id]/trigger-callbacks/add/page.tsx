'use client';

import dynamic from 'next/dynamic';
import { ProjectPermissionGuard } from 'apps/rahat-ui/src/guards/project-permission-guard';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

const AddTriggerCallbackPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AAAddTriggerCallbackView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard action={ACTIONS.UPDATE} subject={SUBJECTS.TRIGGER}>
      <AddTriggerCallbackPage />
    </ProjectPermissionGuard>
  );
}
