'use client';

import ListSiteInfo from '../../sections/projects/aa-2/siteInfo/siteInfoList';
import GlobalPermissionGuard from '../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../constants/ability.constants';

export default function SiteInfoPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.SETTINGS}>
      <ListSiteInfo />
    </GlobalPermissionGuard>
  );
}
