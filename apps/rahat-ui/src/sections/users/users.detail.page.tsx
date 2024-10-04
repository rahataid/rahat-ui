import { truncateEthAddress } from '@rumsan/sdk/utils';
import React from 'react';
import { Copy, CopyCheck, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import HeaderWithBack from '../projects/components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import CoreBtnComponent from '../../components/core.btn';
import SearchInput from '../projects/components/search.input';
import AddButton from '../projects/components/add.btn';
import DemoTable from '../../components/table';
import { useUsersRolesTableColumns } from './use.users.roles.table.columns';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import CustomPagination from '../../components/customPagination';
import { usePagination } from '@rahat-ui/query';
import { useUserStore } from '@rumsan/react-query';

export default function UsersDetailPage() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const User = React.useMemo(() => user.data, [user]);

  const tableData = User?.roles?.map((role: string) => ({ role: role }));

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };

  const columns = useUsersRolesTableColumns();
  const table = useReactTable({
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <HeaderWithBack
            title="User details"
            subtitle="Here is a detailed view of the selected user"
            path="/users"
          />
          <div className="flex space-x-2">
            <CoreBtnComponent
              className="text-primary bg-sky-50"
              name="Assign to Project"
              Icon={FolderPlus}
              handleClick={() => {}}
            />
            <CoreBtnComponent
              name="Edit"
              Icon={Pencil}
              handleClick={() => {
                router;
              }}
            />
            <CoreBtnComponent
              className="bg-red-100 text-red-600"
              name="Delete"
              Icon={Trash2}
              handleClick={() => {}}
            />
          </div>
        </div>
        <div className="p-5 rounded-md shadow border grid grid-cols-4 gap-5">
          <div>
            <h1 className="text-md text-muted-foreground">Name</h1>
            <p className="font-medium">{User?.name ?? 'N/A'}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">Gender</h1>
            <p className="font-medium">{User?.gender ?? 'N/A'}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">Phone Number</h1>
            <p className="font-medium">{User?.phone ?? 'N/A'}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">Email Address</h1>
            <p className="font-medium">{User?.email ?? 'N/A'}</p>
          </div>
          <div>
            <h1 className="text-md text-muted-foreground">Wallet Address</h1>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => clickToCopy(User?.wallet)}
            >
              <p>{truncateEthAddress(User?.wallet)}</p>
              {walletAddressCopied === User?.wallet ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 text-lg">
          <h1 className="font-medium mb-4">User Roles</h1>
          <div className="border rounded-md p-4">
            <div className="flex space-x-2">
              <SearchInput className="w-full" name="Role" onSearch={() => {}} />
              <AddButton
                variant="outline"
                className="border-primary text-primary"
                name="Role"
                path="/users/roles/add"
              />
            </div>
            <DemoTable table={table} tableHeight="h-[calc(100vh-517px)]" />
          </div>
        </div>
      </div>
      <CustomPagination
        meta={{ total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </>
  );
}
