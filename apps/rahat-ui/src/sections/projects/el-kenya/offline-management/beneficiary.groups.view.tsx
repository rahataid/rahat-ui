import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import { Banknote, Users } from 'lucide-react';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { initialStepData } from './select.vendor.multi.step.form';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import ClientSidePagination from '../card.pagination';

interface BeneficiaryGroupsViewProps {
  benificiaryGroups: [];
  handleStepDataChange: (e) => void;
  stepData: typeof initialStepData;
}

export default function BeneficiaryGroupsView({
  benificiaryGroups,
  handleStepDataChange,
  stepData,
}: BeneficiaryGroupsViewProps) {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const filteredGroups = React.useMemo(() => {
    if (benificiaryGroups) {
      return benificiaryGroups.filter((group: any) =>
        group?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
  }, [benificiaryGroups, searchTerm]);

  const paginatedGroups = React.useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredGroups?.slice(start, end) ?? [];
  }, [filteredGroups, currentPage, pageSize]);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [filteredGroups]);

  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <div className="rounded border bg-card p-4 m-4">
      <div className="flex justify-between space-x-2 mb-2">
        <SearchInput
          className="w-full"
          name="beneficiary group"
          onSearch={(e) => handleSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-475px)]">
        {paginatedGroups?.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {paginatedGroups?.map((benificiaryGroup) => {
              return (
                <div
                  key={benificiaryGroup?.uuid}
                  className="cursor-pointer rounded-md border shadow p-4"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-end">
                      <Checkbox
                        checked={stepData?.groups?.some(
                          (group) => group.uuid === benificiaryGroup.uuid,
                        )}
                        onCheckedChange={(e: boolean) => {
                          if (e) {
                            const currentData = stepData.groups;
                            handleStepDataChange({
                              target: {
                                name: 'groups',
                                value: [...currentData, benificiaryGroup],
                              },
                            });
                          } else {
                            const currentData = stepData.groups.filter(
                              (group) => group.uuid !== benificiaryGroup.uuid,
                            );
                            handleStepDataChange({
                              target: {
                                name: 'groups',
                                value: currentData,
                              },
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="rounded-md bg-secondary grid place-items-center h-28">
                      <div className="bg-[#667085] text-white p-2 rounded-full">
                        <Users size={20} strokeWidth={2.5} />
                      </div>
                    </div>
                    <p className="text-base mb-1">{benificiaryGroup?.name}</p>
                    <div className="text-muted-foreground text-sm flex justify-between">
                      <div className="flex gap-2 items-center">
                        <Users size={18} strokeWidth={2} />
                        {benificiaryGroup?.groupedBeneficiaries?.length}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Banknote size={18} strokeWidth={2} />
                        {benificiaryGroup?.groupedBeneficiaries?.length}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center mt-10 text-muted-foreground">No result.</p>
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
  );
}
