'use client';
import ListSetting from '../../sections/settings/list.settings';
import GlobalPermissionGuard from '../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../constants/ability.constants';

export default function SettingsPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.SETTINGS}>
      <ListSetting />
    </GlobalPermissionGuard>
  );
}
