'use client';

import { ProjectPermissionGuard } from 'apps/rahat-ui/src/guards/project-permission-guard';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import dynamic from 'next/dynamic';

const EditPhasePage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AAPhaseEditView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard action={ACTIONS.UPDATE} subject={SUBJECTS.PHASE}>
      <EditPhasePage />
    </ProjectPermissionGuard>
  );
}
