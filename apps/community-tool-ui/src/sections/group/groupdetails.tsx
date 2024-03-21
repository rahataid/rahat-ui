import { useRouter } from 'next/navigation';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Expand, Minus, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/dialog';
import { paths } from '../../routes/paths';
import { ListGroup } from '@rahataid/community-tool-sdk/groups';
import { useRumsanService } from '../../providers/service.provider';
import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import CustomPagination from '../../components/customPagination';
import BenificiaryTable from './beneficiary.table';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
type IProps = {
  data: ListGroup;
  handleClose: VoidFunction;
};

export const columns: ColumnDef<ListBeneficiary>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },

  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <div>{row.getValue('gender')}</div>,
  },
];

export default function GroupDetail({ data, handleClose }: IProps) {
  const router = useRouter();
  const { communityBenQuery, communityBeneficiaryGroupQuery } =
    useRumsanService();

  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  const [selectedData, setSelectedData] = useState<number[]>([]);

  const handleBeneficiaryClick = useCallback((item: ListBeneficiary) => {
    setSelectedData((prevSelectedData) => {
      const isSelected = prevSelectedData?.includes(item.id);

      if (isSelected) {
        return prevSelectedData.filter((selectedId) => selectedId !== item.id);
      } else {
        return [...(prevSelectedData || []), item.id];
      }
    });
  }, []);

  const { data: benefData } = communityBenQuery.useCommunityBeneficiaryList({
    perPage,
    page: currentPage,
  });
  const addBeneficiaryGroup =
    communityBeneficiaryGroupQuery.useCommunityBeneficiaryGroupCreate();
  const table = useReactTable({
    manualPagination: true,
    data: benefData?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  const handleBeneficiaryGroupClick = async () => {
    const k = {
      groupId: data?.id,
      benficiaryId: selectedData,
    };
    await addBeneficiaryGroup.mutateAsync(k);
  };

  return (
    <>
      <Tabs defaultValue="beneficiaryList">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger onClick={handleClose}>
                  <Minus size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    router.push(
                      paths.dashboard.beneficiary.detail(data?.id.toString()),
                    );
                  }}
                >
                  <Expand size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Expand</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Trash2 size={20} strokeWidth={1.5} />
                    </DialogTrigger>
                    <ConfirmDialog name="beneficiary" />
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TabsList>
            <TabsTrigger value="beneficiaryList">Beneficiary List </TabsTrigger>
            <TabsTrigger value="detail">Details </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="beneficiaryList">
          <BenificiaryTable
            table={table}
            handleClick={handleBeneficiaryClick}
          />
          <CustomPagination
            meta={benefData?.response?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handlePageSizeChange={(value) => setPerPage(Number(value))}
          />
          <div className="flex justify-end mt-5">
            <Button
              onClick={handleBeneficiaryGroupClick}
              disabled={selectedData.length === 0}
            >
              Add Beneficiary Group
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
