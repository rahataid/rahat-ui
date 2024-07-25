'use client';

import { usePagination, useRoleList } from '@rahat-ui/query';
import RoleTable from './rolesTable';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export default function RoleView() {
  const { pagination, setNextPage, setPerPage, setPrevPage } = usePagination();

  const { data: roleData } = useRoleList({
    ...pagination,
  });

  return (
    <div>
      <RoleTable roleData={roleData?.data} />
      <CustomPagination
        currentPage={roleData && roleData?.response?.meta?.currentPage}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={roleData && roleData?.response?.meta}
        perPage={pagination.perPage}
        total={roleData && roleData?.response?.meta?.total}
      />

      {/* <UserDetails data={selectedUserData} /> */}
    </div>
  );
}
