'use client';

import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { VendorsEditView } from 'apps/rahat-ui/src/sections/vendors';

const Page = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.UPDATE} subject={SUBJECTS.VENDOR}>
      <VendorsEditView />
    </GlobalPermissionGuard>
  );
};

export default Page;
