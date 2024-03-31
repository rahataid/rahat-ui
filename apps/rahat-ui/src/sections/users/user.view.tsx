'use client';

import { useUserList, useUserStore } from '@rumsan/react-query';
import UsersTable from './user.list';
import { usePagination } from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';

export default function UserView() {
  const { pagination, setNextPage, setPerPage, setPrevPage } = usePagination();
  const users = useUserStore((state) => state.users);
  useUserList({
    page: +pagination.page,
    perPage: +pagination.perPage,
  });
  useUserList();

  return (
    <div>
      <UsersTable />
      <CustomPagination
        currentPage={users.response.meta.currentPage}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={users.response.meta}
        perPage={pagination.perPage}
        total={users.response.meta.total}
      />

      {/* <UserDetails data={selectedUserData} /> */}
    </div>
  );
}
