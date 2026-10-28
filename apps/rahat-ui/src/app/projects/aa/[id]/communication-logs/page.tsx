'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AACommunicationMainLogsView } from 'apps/rahat-ui/src/sections/projects/aa-2/communicationLog';

const Page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.READ}
      subject={SUBJECTS.COMMUNICATION_LOG}
    >
      <AACommunicationMainLogsView />
    </ProjectPermissionGuard>
  );
};

export default Page;
