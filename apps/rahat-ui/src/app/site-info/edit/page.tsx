'use client';

import EditSiteInfo from '../../../sections/projects/aa-2/siteInfo/siteInfo.edit';
import GlobalPermissionGuard from '../../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../../constants/ability.constants';

export default function SiteInfoEditPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.UPDATE} subject={SUBJECTS.SETTINGS}>
      <EditSiteInfo />
    </GlobalPermissionGuard>
  );
}
