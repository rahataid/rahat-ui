'use client';

import ProjectInfoView from '../../../sections/projects/projectInfo.view';
import GlobalPermissionGuard from '../../../components/global-can';
import { ACTIONS, SUBJECTS } from '../../../constants/ability.constants';

export default function ProjectInfoPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.SETTINGS}>
      <ProjectInfoView />
    </GlobalPermissionGuard>
  );
}
