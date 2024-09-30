'use client';

import { usePagination } from '@rahat-ui/query';
import { useRoleList } from '@rahat-ui/community-query';
import RoleTable from './rolesTable';
import CustomPagination from 'apps/community-tool-ui/src/components/customPagination';

export default function RoleView() {
  const { pagination, setNextPage, setPerPage, setPrevPage } = usePagination();

  const { isLoading, data: roleData } = useRoleList({
    ...pagination,
  });

  return (
    <div>
      <RoleTable roleData={roleData?.data} loading={isLoading} />
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
