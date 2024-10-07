import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useElkenyaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
import SelectComponent from '../select.component';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudDownload } from 'lucide-react';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import ViewColumns from '../../components/view.columns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import BeneficiaryGroupView from './beneficiary.group.view';
import FiltersTags from '../../components/filtersTags';

export default function BeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();

  React.useEffect(() => {
    setFilters('');
  }, []);

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const meta = beneficiaries.data.response?.meta;

  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/el-kenya/${id}/beneficiary/${rowData.uuid}?name=${rowData.name}&&walletAddress=${rowData.walletAddress}&&gender=${rowData.gender}&&voucherStatus=${rowData.voucherStatus}&&eyeCheckupStatus=${rowData.eyeCheckupStatus}&&glassesStatus=${rowData.glassesStatus}&&voucherType=${rowData.voucherType}&&phone=${rowData.phone}&&type=${rowData.type}`,
    );
  };

  const columns = useElkenyaBeneficiaryTableColumns({ handleViewClick });
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <Tabs defaultValue="beneficiary">
      <TabsContent value="beneficiary">
        <div>
          <h1 className="font-semibold text-2xl text-label pl-4">
            Beneficiary
          </h1>
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div>
          <h1 className="font-semibold text-2xl text-label pl-4">
            Beneficiary Groups
          </h1>
        </div>
      </TabsContent>
      <div className="flex justify-between items-center p-4">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="beneficiary"
            className="w-full data-[state=active]:bg-white"
            value="beneficiary"
          >
            Beneficiary
          </TabsTrigger>
          <TabsTrigger
            id="beneficiaryGroups"
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryGroups"
          >
            Beneficiary Groups
          </TabsTrigger>
        </TabsList>
        <Button
          variant="outline"
          onClick={() => router.push('/beneficiary/import')}
        >
          <CloudDownload className="mr-1" /> Import beneficiaries
        </Button>
      </div>
      <TabsContent value="beneficiary">
        <div className="p-4">
          <div className="rounded border bg-card p-4">
            <div className="flex justify-between space-x-2 mb-2">
              <SearchInput
                className="w-full"
                name="beneficiary"
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ?? ''
                }
                onSearch={(event) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
              />
              <AddButton
                name="Beneficiary"
                path={`/projects/el-kenya/${id}/beneficiary/add`}
              />
            </div>
            <div className="flex justify-between gap-2 mb-4">
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, voucherType: e })}
                name="Voucher Type"
                options={['SINGLE_VISION', 'READING_GLASSES']}
              />
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, type: e })}
                name="Beneficiary Type"
                options={['PRE_DETERMINED', 'WALK_IN']}
              />
              <SelectComponent
                onChange={(e) =>
                  setFilters({ ...filters, eyeCheckupStatus: e })
                }
                name="Eye Checkup Status"
                options={['CHECKED', 'NOT_CHECKED']}
              />
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, glassesStatus: e })}
                name="Glasses Status"
                options={['  REQUIRED', 'NOT_REQUIRED']}
              />
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, voucherStatus: e })}
                name="Voucher Status"
                options={['REDEEMED', 'NOT_REDEEMED']}
              />
              <ViewColumns table={table} />
            </div>
            {Object.keys(filters).length != 0 && (
              <FiltersTags
                filters={filters}
                setFilters={setFilters}
                total={beneficiaries.data.data.length}
              />
            )}
            <ElkenyaTable table={table} tableHeight="h-[calc(100vh-398px)]" />
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
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div className="p-4">
          <BeneficiaryGroupView />
        </div>
      </TabsContent>
    </Tabs>
  );
}
