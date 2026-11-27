'use client';
import ListVersion from '../../sections/settings/list.version';
import GlobalPermissionGuard from '../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../constants/ability.constants';

export default function VersionPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.SETTINGS}>
      <ListVersion />
    </GlobalPermissionGuard>
  );
}
