'use client';
import AddSetting from '../../../sections/settings/add.settings';
import GlobalPermissionGuard from '../../../components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from '../../../constants/ability.constants';

const AddUserPage = () => {
  return (
    <GlobalPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.SETTINGS}>
      <AddSetting />
    </GlobalPermissionGuard>
  );
};

export default AddUserPage;
