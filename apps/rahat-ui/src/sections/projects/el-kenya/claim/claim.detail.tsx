import {
  PROJECT_SETTINGS_KEYS,
  useContractRedeem,
  useGetRedemption,
  usePagination,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import ElkenyaTable from '../table.component';
import HeaderWithBack from '../../components/header.with.back';
import { Button } from '@rahat-ui/shadcn/components/button';
import useClaimDetailTableColumn from './use.claim.detail.table.columns';
import ClientSidePagination from '../../components/client.side.pagination';

type CardData = {
  title: string;
  label1: string;
  label2: string;
  sublabel1: number;
  sublabel2: number;
};

export default function ClaimDetailView() {
  const router = useRouter();
  const { id, Id } = useParams() as { id: UUID; Id: UUID };
  const [cardData, setCardData] = React.useState<CardData[]>([]);

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

  const { data, refetch, isFetching } = useGetRedemption(id, Id);

  React.useEffect(() => {
    if (data) {
      updateCardData(data.stats);
    }
  }, [data]);

  const updateCardData = (stats: any) => {
    const updatedCardData = [
      {
        title: 'Checkup Status',
        label1: 'Checked',
        label2: 'Not Checked',
        sublabel1: stats.eyeCheckupStatus.CHECKED || 0,
        sublabel2: stats.eyeCheckupStatus.NOT_CHECKED || 0,
      },
      {
        title: 'Glassed Status',
        label1: 'Required',
        label2: 'Not Required',
        sublabel1: stats.glassesStatus.REQUIRED || 0,
        sublabel2: stats.glassesStatus.NOT_REQUIRED || 0,
      },
      {
        title: 'Voucher Type',
        label1: 'Single Vision',
        label2: 'Reading Glass',
        sublabel1: stats.voucherTypes.SINGLE_VISION || 0,
        sublabel2: stats.voucherTypes.READING_GLASS || 0,
      },
      {
        title: 'Voucher Status',
        label1: 'Redeemed',
        label2: 'Not Redeemed',
        sublabel1: stats.voucherStatus.REDEEMED || 0,
        sublabel2: stats.voucherStatus.NOT_REDEEMED || 0,
      },
    ];

    setCardData(updatedCardData);
  };
  const redeemToken = useContractRedeem(id);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const projectClosed = useProjectStore(
    (state) => state.singleProject?.projectClosed,
  );

  const handleSubmit = () => {
    redeemToken
      .mutateAsync({
        amount: data?.voucherAmount,
        tokenAddress: data?.tokenAddress,
        redemptionAddress: contractSettings?.redemptions?.address,
        senderAddress: data?.Vendor.walletAddress,
        uuid: data?.uuid,
      })
      .finally(() => {
        refetch();
      });
  };

  const columns = useClaimDetailTableColumn();
  const table = useReactTable({
    manualPagination: true,
    data: data?.beneficiaries || [],
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
    <>
      <div className="p-4">
        <div className="flex justify-between space-x-4 items-center">
          <HeaderWithBack
            title="Claim Details"
            subtitle={`Here is the detailed view of claim from ${
              data?.Vendor?.name ?? '.....'
            }`}
            path={`/projects/el-kenya/${id}/claim`}
          />
          <Button
            type="submit"
            disabled={data?.status != 'REQUESTED' || projectClosed}
            onClick={handleSubmit}
          >
            Approve
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-5">
          {cardData?.map((item, index) => {
            return (
              <div key={index} className="p-4 rounded-md border bg-card">
                <h1 className="text-lg font-medium mb-2">{item.title}</h1>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {item.label1}
                    </p>
                    <p className="text-primary text-base">{item.sublabel1}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {item.label2}
                    </p>
                    <p className="text-primary text-base">{item.sublabel2}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded border bg-card p-4">
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-399px)]"
            loading={isFetching}
          />
        </div>
      </div>
      <ClientSidePagination table={table} />
    </>
  );
}
