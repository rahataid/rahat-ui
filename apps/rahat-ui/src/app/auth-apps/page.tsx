'use client';
import ListAppAuthentication from '../../sections/auth-apps/list.appAuthentication';
import GlobalPermissionGuard from '../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../constants/ability.constants';

export default function SettingsPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.SETTINGS}>
      <ListAppAuthentication />
    </GlobalPermissionGuard>
  );
}
