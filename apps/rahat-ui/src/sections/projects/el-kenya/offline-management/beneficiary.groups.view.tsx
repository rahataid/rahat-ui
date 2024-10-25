import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import { Banknote, Users } from 'lucide-react';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { initialStepData } from './select.vendor.multi.step.form';

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

  return (
    <div className="p-4">
      <div className="rounded border bg-card p-4">
        <div className="flex justify-between space-x-2 mb-2">
          <SearchInput
            className="w-full"
            name="beneficiary"
            onSearch={() => {}}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="cursor-pointer rounded-md border shadow p-4">
            {benificiaryGroups.map((benificiaryGroup) => {
              console.log(benificiaryGroup);
              return (
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-end">
                    <Checkbox
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
                              name: 'selectedGroups',
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
                  <p className="text-base mb-1">{benificiaryGroup.name}</p>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
