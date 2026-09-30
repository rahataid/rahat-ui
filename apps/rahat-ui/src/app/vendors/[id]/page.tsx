'use client';

import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { VendorsDetailView } from 'apps/rahat-ui/src/sections/vendors';

const Page = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.VENDOR}>
      <VendorsDetailView />
    </GlobalPermissionGuard>
  );
};

export default Page;
