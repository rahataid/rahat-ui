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
import { Archive, Minus, MoreVertical, Pencil } from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import RemoveBenfGroupModal from './removeGroupModal';
import EditBeneficiaryGroups from './edit.beneficiary.groups';
import { UUID } from 'crypto';

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
  const removeModal = useBoolean();
  const [showEditInterface, setShowEditInterface] =
    React.useState<boolean>(false);

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  const handleRemoveClick = () => {
    removeModal.onTrue();
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const columns = useDetailsBeneficiaryTableColumn();

  const tableData = React.useMemo(() => {
    if (beneficiaryGroupDetail) {
      return beneficiaryGroupDetail?.groupedBeneficiaries?.map((d: any) => ({
        uuid: d?.Beneficiary?.uuid,
        name: d?.Beneficiary?.pii?.name,
        phone: d?.Beneficiary?.pii?.phone,
        email: d?.Beneficiary?.pii?.email,
        location: d?.Beneficiary?.location,
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
  const isAssignedToProject =
    beneficiaryGroupDetail?.beneficiaryGroupProject?.length;
  const assignedGroupId = beneficiaryGroupDetail?.beneficiaryGroupProject?.map(
    (benProject: any) => benProject.Project.id,
  );

  React.useEffect(() => {
    setShowEditInterface(false);
  }, [beneficiaryGroupDetail]);
  return (
    <>
      <AssignToProjectModal
        closeSecondPanel={closeSecondPanel}
        beneficiaryGroupDetail={beneficiaryGroupDetail}
        projectModal={projectModal}
        assignedGroupId={assignedGroupId}
      />

      {/* <RemoveBenfGroupModal
        beneficiaryGroupDetail={beneficiaryGroupDetail}
        removeModal={removeModal}
        closeSecondPanel={closeSecondPanel}
      /> */}

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
              <TooltipTrigger
                onClick={() => setShowEditInterface(!showEditInterface)}
              >
                <Pencil
                  className="hover:text-yellow-500 "
                  size={20}
                  strokeWidth={1.5}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                disabled={isAssignedToProject}
                onClick={handleRemoveClick}
              >
                <Archive
                  className={!isAssignedToProject ? 'hover:text-red-500' : ''}
                  size={20}
                  strokeWidth={1.5}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">
                  {isAssignedToProject
                    ? 'Cannot archive a group assigned to project.'
                    : 'Archive'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                className="hover:text-primary"
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
        <div className="gap-4 mb-2">
          <p className="font-semibold text-2xl">
            {beneficiaryGroupDetail.name}
          </p>
          <Card className="shadow rounded my-2">
            <CardHeader>
              <p className="font-mediun text-md">Projects Involved</p>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
        {!showEditInterface ? (
          <>
            <div className="flex justify-between gap-2">
              <SearchInput
                name="Beneficiary"
                className="mb-2 w-full"
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ?? ''
                }
                onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
              />
              <SearchInput
                name="Location"
                className="mb-2 w-full"
                value={
                  (table.getColumn('location')?.getFilterValue() as string) ??
                  ''
                }
                onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                  table
                    .getColumn('location')
                    ?.setFilterValue(event.target.value)
                }
              />
            </div>
            <div className="bg-card border rounded">
              <BeneficiaryTable
                table={table}
                tableScrollAreaHeight="h-[calc(100vh-413px)]"
              />
              <ClientSidePagination table={table} />
            </div>
          </>
        ) : (
          <EditBeneficiaryGroups
            groupUUID={beneficiaryGroupDetail?.uuid as UUID}
            groupName={beneficiaryGroupDetail?.name}
            groupedBeneficiaries={tableData}
            isGroupAssignedToProject={isAssignedToProject}
          />
        )}
      </div>
    </>
  );
}
