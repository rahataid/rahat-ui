'use client';
import CoreHealthView from '../../sections/settings/core-health.view';
import GlobalPermissionGuard from '../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../constants/ability.constants';

export default function HealthPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.SETTINGS}>
      <CoreHealthView />
    </GlobalPermissionGuard>
  );
}
