import AddButton from '../projects/components/add.btn';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import DemoTable from '../../components/table';
import { useUsersRolesTableColumns } from './use.users.roles.table.columns';
import { User } from '@rumsan/sdk/types';

type IProps = {
  userDetail: User;
};

export default function UsersRolesTabSplitView({ userDetail }: IProps) {
  console.log({ userDetail });
  const columns = useUsersRolesTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-medium">User Roles</h1>
        <AddButton
          variant="ghost"
          className="text-primary"
          name="Role"
          path=""
        />
      </div>
      <DemoTable table={table} tableHeight="h-[calc(100vh-400px)]" />
    </div>
  );
}
