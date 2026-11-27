'use client';

import ListProject from '../../sections/projects/projectList';
import GlobalPermissionGuard from '../../components/global-can';
import { ACTIONS, SUBJECTS } from '../../constants/ability.constants';

export default function ProjectInfoPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.SETTINGS}>
      <ListProject />
    </GlobalPermissionGuard>
  );
}
