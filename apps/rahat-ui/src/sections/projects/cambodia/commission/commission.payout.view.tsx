import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  CircleEllipsisIcon,
  Coins,
  CoinsIcon,
  DollarSignIcon,
  Home,
  LucideIcon,
  Users,
  UsersIcon,
} from 'lucide-react';
import SearchInput from '../../components/search.input';
import ViewColumns from '../../components/view.columns';
import CambodiaTable from '../table.component';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';
import {
  useCambodiaCommisionCurrent,
  useCambodiaCommisionStats,
  usePagination,
} from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useParams, useRouter } from 'next/navigation';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => <div>{row.getValue('topic')}</div>,
  },
  {
    accessorKey: 'hash',
    header: 'TxHash',
    cell: ({ row }) => <div>{row.getValue('hash')}</div>,
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => <div>{row.getValue('TimeStamp')}</div>,
  },
];

export default function CommissionPayoutView() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data } = useCambodiaCommisionCurrent({
    projectUUID: id as string,
  }) as any;

  const { data: commisionStats, isFetching } = useCambodiaCommisionStats({
    projectUUID: id as string,
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const iconMap = {
    TOTAL_COMMISSION_EARNED: DollarSignIcon as LucideIcon,
    TOTAL_LEAD_CONVERTED: UsersIcon as LucideIcon,
  };
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

  const table = useReactTable({
    manualPagination: true,
    data: [
      { walletAddress: '123', topic: 'A1' },
      { walletAddress: '456', topic: 'B1' },
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  return (
    <>
      {isFetching ? (
        <>
          <div className="flex items-center justify-center mt-4">
            <div className="text-center">
              <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />

              <Label className="text-base">Loading ...</Label>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-semibold text-[28px]">
                Commission Payout Scheme
              </h1>
              <p className="text-muted-foreground text-base">
                {data?.data?.leads} lead converted is equal to{' '}
                {data?.data?.commission} {data?.data?.currency}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary"
              onClick={() =>
                router.push(`/projects/el-cambodia/${id}/commission/update`)
              }
            >
              Update Scheme
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <>
              {commisionStats?.map((item, index) => {
                const Icon: LucideIcon =
                  iconMap[item.name as keyof typeof iconMap];
                const toTitleCase = (str: string) =>
                  str
                    .toLowerCase()
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                return (
                  <DataCard
                    key={index}
                    className="border-solid rounded-md"
                    iconStyle="bg-white text-black"
                    title={
                      item?.name == 'TOTAL_LEAD_CONVERTED'
                        ? 'Total Eye Checkup In VC'
                        : toTitleCase(item?.name)
                    }
                    number={
                      typeof item?.data?.count === 'string'
                        ? item?.data?.count
                        : item?.data?.count.toLocaleString()
                    }
                    Icon={Icon}
                  />
                );
              })}
              <DataCard
                className="border-solid rounded-md"
                iconStyle="bg-white text-black"
                title={'Total Commission Paid'}
                number={'0'}
                Icon={CoinsIcon}
              />
            </>
          </div>
        </div>
      )}
    </>
  );
}
