'use client';

import { useCommunityUsersList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import React from 'react';
import CustomPagination from '../../components/customPagination';
import UsersTable from './user.list';

export default function UserView() {
  const { pagination, setNextPage, setPerPage, setPrevPage } = usePagination();

  const { data, isSuccess } = useCommunityUsersList({
    page: pagination.page,
    perPage: pagination.perPage,
  });

  const users = React.useMemo(() => {
    if (isSuccess) return data?.data;
    else return [];
  }, [isSuccess, data?.data]);

  return (
    <div>
      <UsersTable users={users} />
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={data?.response?.meta?.total || 0}
      />

      {/* <UserDetails data={selectedUserData} /> */}
    </div>
  );
}
