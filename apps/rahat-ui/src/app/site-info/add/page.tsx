'use client';

import AddSiteInfo from '../../../sections/projects/aa-2/siteInfo/siteInfo.add';
import GlobalPermissionGuard from '../../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../../constants/ability.constants';

export default function SiteInfoAddPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.SETTINGS}>
      <AddSiteInfo />
    </GlobalPermissionGuard>
  );
}
