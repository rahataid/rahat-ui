'use client';
import { useEffect, useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  useBeneficiaryStore,
  useListTempBeneficiary,
  usePagination,
  useTempBeneficiaryImport,
} from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import { useDebounce } from '../../utils/useDebouncehooks';
import ListView from './list.view';
import { useCommunityBeneficiaryTableColumns } from './useCommunityBeneficiaryColumn';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import HeaderWithBack from '../projects/components/header.with.back';
import DataCard from '../../components/dataCard';
import {
  Calendar,
  CloudDownload,
  CloudDownloadIcon,
  Users2,
} from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
function ViewCommunityBeneficiaryByGroupName() {
  const t = useTranslations('COMMUNITY_BENEFICIARY_DETAIL');
  const tg = useTranslations('GLOBAL');
  const {
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
    resetSelectedListItems,
  } = usePagination();

  const { uuid } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupName = searchParams.get('name');
  const date = searchParams.get('date') as string;
  const importTempBeneficiaries = useTempBeneficiaryImport();

  const debouncedFilters = useDebounce(filters, 500);
  const { setCommunityBeneficiariesUUID, communityBeneficiariesUUID } =
    useBeneficiaryStore();

  const { data, isLoading } = useListTempBeneficiary(uuid as string, {
    ...pagination,
    ...(debouncedFilters as any),
  });
  const columns = useCommunityBeneficiaryTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.tempBeneficiaries || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  useEffect(() => {
    setCommunityBeneficiariesUUID(
      Object.keys(selectedListItems).filter((key) => selectedListItems[key]),
    );
  }, [selectedListItems, setCommunityBeneficiariesUUID]);

  useEffect(() => {
    if (communityBeneficiariesUUID.length === 0) {
      resetSelectedListItems();
    }
  }, [resetSelectedListItems, communityBeneficiariesUUID.length]);
  const formatDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(date));
  const handleImportBeneficiaries = async () => {
    const res = await importTempBeneficiaries.mutateAsync({
      groupUUID: uuid,
    });
    if (res?.response?.success) {
      setTimeout(() => {
        router.push('/beneficiary');
      }, 1500);
    }
  };
  return (
    <div className="p-4 space-y-4 pb-0 ">
      <div className="flex justify-between">
        <HeaderWithBack
          title={groupName as string}
          subtitle={t('HERE_IS_THE_DETAILED_VIEW_OF')}
          path="/community-beneficiary"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="gap-2" variant="outline">
              <CloudDownloadIcon className="w-4 h-4" /> {t('IMPORT_TO_RAHAT')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="mx-auto">
              <AlertDialogTitle className="flex flex-col  items-center justify-center">
                <CloudDownloadIcon className="w-6 h-6" />
                <div>{t('IMPORT_BENEFICIARY_GROUP')}</div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('ARE_YOU_SURE_YOU_WANT_TO')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tg('CANCEL')}</AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={handleImportBeneficiaries}
              >
                {t('IMPORT')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pl-1 mb-2">
        <DataCard
          title={tg('TOTAL_BENEFICIARIES')}
          Icon={Users2}
          smallNumber={data?.data?.tempBeneficiaries.length || 0}
        />

        <DataCard title={t('CREATED_AT')} Icon={Calendar} smallNumber={formatDate} />
      </div>
      <div className="p-4 pb-8 border rounded-sm ">
        <ListView
          table={table}
          setFilters={setFilters}
          filters={filters}
          pagination={pagination}
          setPagination={setPagination}
          loading={isLoading}
        />
      </div>

      <CustomPagination
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={data?.response?.meta?.total || 0}
      />
    </div>
  );
}

export default ViewCommunityBeneficiaryByGroupName;
