'use client';

import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import { ACTIONS, SUBJECTS } from 'apps/rahat-ui/src/constants/ability.constants';
import BeneficiaryView from '../../sections/beneficiary/beneficiary.view';

export default function BeneficiaryPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.BENEFICIARY}>
      <BeneficiaryView />
    </GlobalPermissionGuard>
  );
}
