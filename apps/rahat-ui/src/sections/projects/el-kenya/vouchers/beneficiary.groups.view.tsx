import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import SearchInput from '../../components/search.input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Banknote, Plus, Users } from 'lucide-react';
import {
  useFindAllBeneficiaryGroups,
  useGetBeneficiariesDisbursements,
} from '@rahat-ui/query';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { group } from 'console';
interface BeneficiaryGroupsView {
  handleStepDataChange: (e) => void;
  handleNext: any;
  setBeneficiaryGroupSelected: any;
  stepData: any;
}

export default function BeneficiaryGroupsView({
  handleStepDataChange,
  handleNext,
  setBeneficiaryGroupSelected,
  stepData,
}: BeneficiaryGroupsView) {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  const { data: beneficiaryGroups } = useFindAllBeneficiaryGroups(id as UUID);
  const groupId = beneficiaryGroups?.map(
    (beneficiaryGroup: any) => beneficiaryGroup?.uuid,
  );

  const { data: benificiaryDisbursement, refetch } =
    useGetBeneficiariesDisbursements(id as UUID, groupId || []);

  const [disbursementData, setDisbursementData] = React.useState([]);

  const [selectedGroup, setSelectedGroup] = React.useState<any[]>([]);
  const [isSelectAll, setIsSelectAll] = React.useState<boolean>(false);

  useEffect(() => {
    if (benificiaryDisbursement) {
      setDisbursementData(benificiaryDisbursement);
    }
  }, [benificiaryDisbursement]);
  console.log(beneficiaryGroups, disbursementData);

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
    <div className="p-4">
      <div className="rounded border bg-card p-4">
        <div className="flex justify-between space-x-2 mb-2">
          <SearchInput
            className="w-full"
            name="beneficiary"
            onSearch={() => {}}
          />

          <Button
            type="button"
            disabled={selectedGroup?.length === 0}
            onClick={
              () => {
                setBeneficiaryGroupSelected(true);
                handleNext();
              }
              // router.push(
              //   `/projects/el-kenya/${id}/vouchers/bulk?benefGroup=true`,
              // )
            }
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
        <div className="grid grid-cols-4 gap-4">
          {beneficiaryGroups?.map((beneficiaryGroup) => {
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
                    {/* <Checkbox
                      onCheckedChange={(e: boolean) => {
                        if (e) {
                          const currentData = stepData.selectedGroups;
                          handleStepDataChange({
                            target: {
                              name: 'selectedGroups',
                              value: [...currentData, beneficiaryGroup],
                            },
                          });
                        } else {
                          const currentData = stepData.selectedGroups.filter(
                            (group) => group.uuid !== beneficiaryGroup.uuid,
                          );
                          handleStepDataChange({
                            target: {
                              name: 'selectedGroups',
                              value: currentData,
                              beneficiaryGroup,
                            },
                          });
                          // const filteredSelected = selectedGroupId.filter(
                          //   (id) => id !== uuid,
                          // );
                          // setSelectedGroupId(filteredSelected);
                        }
                      }}
                    /> */}
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
                      {beneficiaryGroup?._count?.groupedBeneficiaries}
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
      </div>
    </div>
  );
}
