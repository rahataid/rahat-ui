import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  PROJECT_SETTINGS_KEYS,
  useAssignClaimsToBeneficiary,
  useProjectSettingsStore,
  useRpSingleBeneficiaryGroup,
  useSingleBeneficiaryGroup,
} from '@rahat-ui/query';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import useDetailsBeneficiaryTableColumn from './table/useDetailsBeneficiaryTableColumn';
import BeneficiaryTable from './table/beneficiary.table';
import ClientSidePagination from '../../../components/client.side.pagination';
import GroupAssignToken from './table/group-assign-token.modal';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function BeneficiaryGroupDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.groupId as UUID;

  const { data: groupDetails, isLoading } = useRpSingleBeneficiaryGroup(
    projectId,
    groupId,
  );
  const contractSettings = useProjectSettingsStore(
    (state) =>
      state.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const assignToken = useAssignClaimsToBeneficiary();

  const columns = useDetailsBeneficiaryTableColumn();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const tableData = React.useMemo(() => {
    if (groupDetails) {
      return groupDetails?.groupedBeneficiaries?.map((d: any) => ({
        name: d?.Beneficiary?.pii?.name,
        walletAddress: d?.Beneficiary?.walletAddress,
        tokenAmount: 0,
      }));
    } else return [];
  }, [groupDetails]);

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const handleAssignSubmit = async (numberOfTokens: string) => {
    groupDetails?.groupedBeneficiaries?.map(async (d: any) => {
      await assignToken.mutateAsync({
        beneficiary: d?.Beneficiary?.walletAddress,
        projectAddress: contractSettings?.rpproject?.address,
        tokenAmount: numberOfTokens,
      });
    });
  };
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <div className="w-full flex justify-between gap-4 items-center">
              <div>
                <h1 className="text-2xl font-semibold">{groupDetails?.name}</h1>
                <p className="text-gray-500 font-normal text-base">
                  This is the list of beneficiaries in this group
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gray-300 text-black-600">Cancel</Button>
                <GroupAssignToken handleSubmit={handleAssignSubmit} />
              </div>
            </div>
            <div className="flex gap-4 items-center"></div>
          </div>
          {/* Table Starts  */}
          <div className="flex justify-between gap-2"></div>
          <div className="bg-card border rounded">
            <BeneficiaryTable
              table={table}
              tableScrollAreaHeight="h-[calc(100vh-232px)]"
            />
            <ClientSidePagination table={table} />
          </div>
          {/* Table Ends  */}
        </>
      )}
    </div>
  );
}
