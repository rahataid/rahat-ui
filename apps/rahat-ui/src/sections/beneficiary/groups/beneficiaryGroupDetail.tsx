'use client';

import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Archive, Minus, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import AssignToProjectModal from './assignToProjectModal';
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import BeneficiaryTable from '../../projects/aa/groups/beneficiary/details/table/beneficiary.table';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import useDetailsBeneficiaryTableColumn from '../../projects/aa/groups/beneficiary/details/table/useDetailsBeneficiaryTableColumn';
import ClientSidePagination from '../../projects/components/client.side.pagination';
import SearchInput from '../../projects/components/search.input';

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryGroupDetail({
  beneficiaryGroupDetail,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  const projectModal = useBoolean();

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const columns = useDetailsBeneficiaryTableColumn();

  const tableData = React.useMemo(() => {
    if (beneficiaryGroupDetail) {
      return beneficiaryGroupDetail?.groupedBeneficiaries?.map((d: any) => ({
        name: d.Beneficiary.pii.name,
        phone: d.Beneficiary.pii.phone,
        email: d.Beneficiary.pii.email,
        location: d.Beneficiary.location,
      }));
    } else return [];
  }, [beneficiaryGroupDetail]);

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

  return (
    <>
      <AssignToProjectModal
        beneficiaryGroupDetail={beneficiaryGroupDetail}
        projectModal={projectModal}
      />
      <div className="flex justify-between p-4 pt-5 bg-card border-b">
        <div className="flex gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={closeSecondPanel}>
                <Minus size={20} strokeWidth={1.5} />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Archive size={20} strokeWidth={1.5} />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Archive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                className="cursor-pointer"
                size={20}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleAssignModalClick}>
                Assign to project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-2 bg-secondary">
        <div className="flex justify-between items-center gap-4 mb-2">
          <p className="font-semibold text-2xl">
            {beneficiaryGroupDetail.name}
          </p>
          <div className="flex gap-3 items-center">
            <p className="font-medium text-md">Projects Involved:</p>
            {beneficiaryGroupDetail?.beneficiaryGroupProject?.length ? (
              beneficiaryGroupDetail?.beneficiaryGroupProject?.map(
                (benProject: any) => {
                  return (
                    <Badge
                      key={benProject.id}
                      variant="outline"
                      color="primary"
                      className="rounded cursor-pointer bg-card"
                      onClick={() => {
                        router.push(
                          `/projects/${benProject.Project?.type}/${benProject.Project.uuid}`,
                        );
                      }}
                    >
                      {benProject.Project.name}
                    </Badge>
                  );
                },
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                No projects involved
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <SearchInput
            name="Beneficiary"
            className="mb-2 w-full"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
          />
          <SearchInput
            name="Location"
            className="mb-2 w-full"
            value={
              (table.getColumn('location')?.getFilterValue() as string) ?? ''
            }
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('location')?.setFilterValue(event.target.value)
            }
          />
        </div>
        <div className="bg-card border rounded">
          <BeneficiaryTable
            table={table}
            tableScrollAreaHeight="h-[calc(100vh-287px)]"
          />
          <ClientSidePagination table={table} />
        </div>
      </div>
    </>
  );
}
