import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useElkenyaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React, { useEffect } from 'react';
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

  const [defaultValue, setDefaultValue] = React.useState<string>('beneficiary');

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'beneficiary';

  useEffect(() => {
    setDefaultValue(tab);
  }, [tab]);
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

  const { data: beneficiaries, isLoading } = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });

  const meta = beneficiaries?.response?.meta;

  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/el-kenya/${id}/beneficiary/${rowData.uuid}?name=${rowData.name}&&walletAddress=${rowData.walletAddress}&&gender=${rowData.gender}&&voucherStatus=${rowData.voucherStatus}&&eyeCheckupStatus=${rowData.eyeCheckupStatus}&&glassesStatus=${rowData.glassesStatus}&&voucherType=${rowData.voucherType}&&phone=${rowData.phone}&&type=${rowData.type}&&location=${rowData?.projectData?.location}&&serialNumber=${rowData?.extras?.serialNumber}`,
    );
  };

  const columns = useElkenyaBeneficiaryTableColumns({ handleViewClick });
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries?.data || [],
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
  const onTabChange = (value) => {
    setDefaultValue(value);
  };

  return (
    <Tabs value={defaultValue} onValueChange={onTabChange}>
      <div className="flex justify-between items-center p-4 pb-0">
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
          onClick={() =>
            router.push(`/projects/el-kenya/${id}/beneficiary/import`)
          }
        >
          <CloudDownload className="mr-1" /> Import beneficiaries
        </Button>
      </div>
      <TabsContent value="beneficiary">
        <div className="p-4 pt-2">
          <div className="rounded border bg-card p-4">
            <div className="flex justify-between space-x-2 mb-2">
              <SearchInput
                className="w-full"
                name="phone number"
                value={
                  (table.getColumn('phone')?.getFilterValue() as string) ?? ''
                }
                onSearch={(event) =>
                  table.getColumn('phone')?.setFilterValue(event.target.value)
                }
              />
              <AddButton
                name="Beneficiary"
                path={`/projects/el-kenya/${id}/beneficiary/add`}
              />
            </div>
            <div className="flex justify-between gap-2 mb-2">
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, voucherType: e })}
                name="Voucher Type"
                options={['SINGLE_VISION', 'READING_GLASSES']}
                value={filters?.voucherType || ''}
              />
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, type: e })}
                name="Beneficiary Type"
                options={['PRE_DETERMINED', 'WALK_IN']}
                value={filters?.type || ''}
              />
              <SelectComponent
                onChange={(e) =>
                  setFilters({ ...filters, eyeCheckupStatus: e })
                }
                name="Eye Checkup Status"
                options={['CHECKED', 'NOT_CHECKED']}
                value={filters?.eyeCheckupStatus || ''}
              />
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, glassesStatus: e })}
                name="Glasses Status"
                options={['REQUIRED', 'NOT_REQUIRED']}
                value={filters?.glassesStatus || ''}
              />
              <SelectComponent
                onChange={(e) => setFilters({ ...filters, voucherStatus: e })}
                name="Voucher Status"
                options={['REDEEMED', 'NOT_REDEEMED']}
                value={filters?.voucherStatus || ''}
              />
              <ViewColumns table={table} />
            </div>
            {Object.keys(filters).length != 0 && (
              <FiltersTags
                filters={filters}
                setFilters={setFilters}
                total={beneficiaries?.data?.length}
              />
            )}
            <ElkenyaTable
              table={table}
              tableHeight={
                Object.keys(filters).length
                  ? 'h-[calc(100vh-389px)]'
                  : 'h-[calc(100vh-323px)]'
              }
              loading={isLoading}
            />
          </div>
        </div>
        <CustomPagination
          meta={meta || { total: 0, currentPage: 0 }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={0}
        />
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div className="p-4 pt-2">
          <BeneficiaryGroupView />
        </div>
      </TabsContent>
    </Tabs>
  );
}
