import {
  PayoutMode,
  useGetVendorBeneficiaries,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { DemoTable, Heading, SearchInput } from 'apps/rahat-ui/src/common';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useActiveTabDynamicKey } from 'apps/rahat-ui/src/utils/useActiveTabDynamicKey';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { useVendorsBeneficiaryTableColumns } from '../columns/useBeneficiaryColumns';
import { toTitleCase } from 'apps/rahat-ui/src/utils/string';
import { getPaginationFromLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage.dynamic';
import { PaginationTableName } from 'apps/rahat-ui/src/constants/pagination.table.name';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

interface VendorsBeneficiaryListProps {
  beneficiaryData?: {
    success: boolean;
    data: any[];
    meta: any;
  };
  loading?: boolean;
}

export default function VendorsBeneficiaryList({
  beneficiaryData,
  loading,
}: VendorsBeneficiaryListProps) {
  const tGlobal = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const { id, vendorId } = useParams();
  const { activeTab, setActiveTab } = useActiveTabDynamicKey(
    'subTab',
    PayoutMode.ONLINE,
  );

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
  } = usePagination();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const debounceSearch = useDebounce(filters, 500);

  const { data, isLoading } = useGetVendorBeneficiaries({
    projectUUID: id,
    vendorUuid: vendorId,
    payoutMode:
      activeTab === PayoutMode.ONLINE ? PayoutMode.ONLINE : PayoutMode.OFFLINE,
    ...pagination,
    walletAddress: debounceSearch.walletAddress,
  });

  const onlineQuery = useGetVendorBeneficiaries({
    projectUUID: id,
    vendorUuid: vendorId,
    payoutMode: PayoutMode.ONLINE,
  });

  const offlineQuery = useGetVendorBeneficiaries({
    projectUUID: id,
    vendorUuid: vendorId,
    payoutMode: PayoutMode.OFFLINE,
  });

  const totalOnlineBeneficiary = onlineQuery?.data?.response?.meta?.total;
  const totalOfflineBeneficiary = offlineQuery?.data?.response?.meta?.total;

  const tableData = useMemo(() => {
    if (data?.response?.data?.length > 0) {
      return data?.response?.data?.map((beneficiary: any) => {
        return {
          name: beneficiary?.name,
          benTokens: beneficiary?.benTokens,
          walletAddress: beneficiary?.walletAddress,
          uuid: beneficiary?.uuid,
          txHash: beneficiary?.txHash,
          status: beneficiary?.status,
        };
      });
    } else {
      return [];
    }
  }, [data?.response?.data]);

  const columns = useVendorsBeneficiaryTableColumns(
    activeTab as PayoutMode,
    pagination,
  );
  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  const handleModeChange = (newMode: PayoutMode) => {
    setActiveTab(newMode);
    setPagination({ ...pagination, page: 1 });
  };

  const searchParams = useSearchParams();

  const [isPaginationReady, setIsPaginationReady] = React.useState(false);

  React.useEffect(() => {
    const isBackFromDetail =
      searchParams.get('isBackFromBeneficiaryDetail') === 'true';
    const prevPagination = getPaginationFromLocalStorage(
      activeTab === PayoutMode.ONLINE
        ? PaginationTableName.VENDOR_ONLINE_BENEFICIARY_LIST
        : PaginationTableName.VENDOR_OFFLINE_BENEFICIARY_LIST,
      isBackFromDetail,
    );
    setPagination(prevPagination);
    setIsPaginationReady(true);
  }, [searchParams, setPagination, activeTab]);

  return (
    <div className="space-y-4">
      <div className="flex border-b mb-4">
        <button
          onClick={() => handleModeChange(PayoutMode.ONLINE)}
          className={`py-2 px-4 text-sm font-medium flex items-center gap-2 ${
            activeTab === PayoutMode.ONLINE
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          {tGlobal('ONLINE')}
          <Badge
            className={`h-5 min-w-[20px] justify-center text-white px-2 py-0 ${
              activeTab === PayoutMode.ONLINE ? 'bg-[#297AD6]' : 'bg-[#8390A2]'
            }`}
          >
            {formatNum(totalOnlineBeneficiary)}
          </Badge>
        </button>
        <button
          onClick={() => handleModeChange(PayoutMode.OFFLINE)}
          className={`py-2 px-4 text-sm font-medium flex items-center gap-2 ${
            activeTab === PayoutMode.OFFLINE
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          {tGlobal('OFFLINE')}
          <Badge
            className={`h-5 min-w-[20px] justify-center text-white px-2 py-0 ${
              activeTab === PayoutMode.OFFLINE ? 'bg-[#297AD6]' : 'bg-[#8390A2]'
            }`}
          >
            {formatNum(totalOfflineBeneficiary)}
          </Badge>
        </button>
      </div>
      <Heading
        title={tGlobal(activeTab === PayoutMode.ONLINE ? 'ONLINE_BENEFICIARIES' : 'OFFLINE_BENEFICIARIES')}
        titleStyle="text-lg"
        description={tGlobal(activeTab === PayoutMode.ONLINE ? 'ONLINE_BENEFICIARIES_DESC' : 'OFFLINE_BENEFICIARIES_DESC')}
      />
      <SearchInput
        className="w-full flex-[4]"
        name={tGlobal('WALLET_ADDRESS')}
        onSearch={(e) => handleSearch(e, 'walletAddress')}
        value={filters?.walletAddress || ''}
      />
      <DemoTable
        table={table}
        tableHeight={'h-[calc(400px)]'}
        loading={isLoading}
      />
      {isPaginationReady && (
        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          meta={data?.response?.meta || { total: 0, currentPage: 0 }}
          perPage={pagination?.perPage}
          total={data?.response?.meta?.total || 0}
        />
      )}
    </div>
  );
}
