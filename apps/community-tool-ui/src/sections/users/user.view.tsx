'use client';

import { useUserList, useUserStore } from '@rumsan/react-query';
import UsersTable from './user.list';
import { usePagination } from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import { useCommunityUsersList } from '@rahat-ui/community-query';
import React from 'react';
// import { useCommunityUsersList } from '@rahat-ui/community-query';

export default function UserView() {
  const { pagination, setNextPage, setPerPage, setPrevPage } = usePagination();
  // const users = useUserStore((state) => state.users);
  // useUserList({
  //   page: +pagination.page,
  //   perPage: +pagination.perPage,
  // });
  // const usek = useCommunityUsersList(pagination);
  // console.log('users', usek);
  // const { data: users } = useCommunityUsersList({});
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
        currentPage={data && data?.response?.meta?.currentPage}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination.perPage}
        total={data?.response?.meta?.total || 0}
      />

      {/* <UserDetails data={selectedUserData} /> */}
    </div>
  );
}
