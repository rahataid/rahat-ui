'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import AddInkindView from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/add.inkind';

const AddInkindPage = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN]}>
      <AddInkindView />
    </RoleAuth>
  );
};

export default AddInkindPage;
