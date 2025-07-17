import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import SearchInput from '../../components/search.input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Banknote, Plus, Users } from 'lucide-react';
import {
  useFindAllBeneficiaryGroups,
  useFindUnSyncedBeneficaryGroup,
  useGetBeneficiariesDisbursements,
} from '@rahat-ui/query';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import ClientSidePagination from '../card.pagination';
interface BeneficiaryGroupsView {
  handleStepDataChange: (e) => void;
  handleNext: any;
  setBeneficiaryGroupSelected: any;
  stepData: any;
  disabledBulkAssign: boolean;
}

export default function BeneficiaryGroupsView({
  handleStepDataChange,
  handleNext,
  setBeneficiaryGroupSelected,
  stepData,
  disabledBulkAssign,
}: BeneficiaryGroupsView) {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const { data: benefGroups, isFetching } = useFindUnSyncedBeneficaryGroup(
    id as UUID,
    {
      page: 1,
      perPage: 100,
      disableSync: false,
      hasDisbursement: false,
      order: 'desc',
      sort: 'createdAt',
    },
  );

  const beneficiaryGroups = React.useMemo(() => {
    return benefGroups?.filter(
      (group: any) => group?.groupedBeneficiaries?.length > 0,
    );
  }, [benefGroups]);

  // const { data: beneficiaryGroups } = useFindAllBeneficiaryGroups(id as UUID, {
  //   page: 1,
  //   perPage: 100,
  //   order: 'desc',
  //   sort: 'createdAt',
  // });

  const filteredGroups = React.useMemo(() => {
    return beneficiaryGroups?.filter((group) =>
      group.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [beneficiaryGroups, searchTerm]);

  const groupId = beneficiaryGroups?.map(
    (beneficiaryGroup: any) => beneficiaryGroup?.uuid,
  );

  const { data: benificiaryDisbursement, refetch } =
    useGetBeneficiariesDisbursements(id as UUID, groupId || []);

  const [disbursementData, setDisbursementData] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [selectedGroup, setSelectedGroup] = React.useState<any[]>([]);
  const [isSelectAll, setIsSelectAll] = React.useState<boolean>(false);

  const paginatedGroups = React.useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredGroups?.slice(start, end) ?? [];
  }, [filteredGroups, currentPage, pageSize]);

  useEffect(() => {
    if (benificiaryDisbursement) {
      setDisbursementData(benificiaryDisbursement);
    }
  }, [benificiaryDisbursement]);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [filteredGroups]);
  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Handle individual checkbox changes
  const handleCheckboxChange = (group: any, isChecked: boolean) => {
    const updatedSelectedGroups = isChecked
      ? [...selectedGroup, group]
      : selectedGroup.filter((sgroup) => sgroup.uuid !== group.uuid);

    setSelectedGroup(updatedSelectedGroups);

    // Update the step data
    handleStepDataChange({
      target: {
        name: 'selectedGroups',
        value: updatedSelectedGroups,
      },
    });

    // Update "Select All" checkbox state
    setIsSelectAll(updatedSelectedGroups.length === beneficiaryGroups?.length);
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (isChecked: boolean) => {
    if (isChecked) {
      // const allGroupIds =
      // beneficiaryGroups?.map((group: any) => group.uuid) || [];
      setSelectedGroup(beneficiaryGroups || []);

      handleStepDataChange({
        target: { name: 'selectedGroups', value: beneficiaryGroups },
      });
    } else {
      setSelectedGroup([]);

      handleStepDataChange({
        target: { name: 'selectedGroups', value: [] },
      });
    }
    setIsSelectAll(isChecked);
  };
  return (
    <div className="p-4 pt-2">
      <div className="rounded border bg-card p-4">
        <div className="flex justify-between space-x-2 mb-2">
          <SearchInput
            className="w-full"
            name="beneficiary group"
            onSearch={(e) => handleSearch(e.target.value)}
          />

          <Button
            type="button"
            disabled={selectedGroup?.length === 0 || disabledBulkAssign}
            onClick={() => {
              setBeneficiaryGroupSelected(true);
              handleNext();
            }}
          >
            <Plus size={18} className="mr-1" />
            Bulk Assign
          </Button>
        </div>
        {beneficiaryGroups?.length > 0 ? (
          <div className="flex space-x-2 items-center mb-2">
            <Checkbox
              checked={isSelectAll}
              onCheckedChange={(checked) =>
                handleSelectAllChange(checked as boolean)
              }
            />
            <p>Select all</p>
          </div>
        ) : null}
        <ScrollArea className="h-[calc(100vh-480px)]">
          {isFetching ? (
            <TableLoader />
          ) : paginatedGroups?.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {paginatedGroups?.map((beneficiaryGroup) => {
                const disbursements = disbursementData?.filter(
                  (disbursement) =>
                    disbursement.beneficiaryGroupId === beneficiaryGroup.uuid,
                );
                let totalAmount = 0;
                disbursements?.map(
                  (disbursement) => (totalAmount += disbursement.amount),
                );

                return (
                  <div
                    key={beneficiaryGroup?.uuid}
                    className="cursor-pointer rounded-md border shadow p-4"
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-end">
                        <Checkbox
                          checked={selectedGroup.some(
                            (sg) => sg.uuid === beneficiaryGroup.uuid,
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              beneficiaryGroup,
                              checked as boolean,
                            )
                          }
                        />
                      </div>

                      <div className="rounded-md bg-secondary grid place-items-center h-28">
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>
                      <p className="text-base mb-1">{beneficiaryGroup?.name}</p>
                      <div className="text-muted-foreground text-sm flex justify-between">
                        <div className="flex gap-2 items-center">
                          <Users size={18} strokeWidth={2} />
                          {beneficiaryGroup?.groupedBeneficiaries?.length}
                        </div>
                        <div className="flex gap-2 items-center">
                          <Banknote size={18} strokeWidth={2} />
                          {totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center mt-10 text-muted-foreground">
              No result.
            </p>
          )}
        </ScrollArea>
        <ClientSidePagination
          totalItems={filteredGroups?.length || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
