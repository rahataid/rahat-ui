'use client';
import AddAppAuthentication from 'apps/rahat-ui/src/sections/auth-apps/app.authentication.add';
import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

const AddUserPage = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.SETTINGS}>
      <AddAppAuthentication />
    </GlobalPermissionGuard>
  );
};

export default AddUserPage;
