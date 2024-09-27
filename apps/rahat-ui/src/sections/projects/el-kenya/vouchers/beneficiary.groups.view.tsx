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

  const { data: benificiaryGroups } = useFindAllBeneficiaryGroups(id as UUID);
  const groupId = benificiaryGroups?.map(
    (benificiaryGroup: any) => benificiaryGroup?.uuid,
  );

  const { data: benificiaryDisbursement, refetch } =
    useGetBeneficiariesDisbursements(id as UUID, groupId || []);

  const [disbursementData, setDisbursementData] = React.useState([]);

  useEffect(() => {
    if (benificiaryDisbursement) {
      setDisbursementData(benificiaryDisbursement);
    }
  }, [benificiaryDisbursement]);
  console.log(benificiaryGroups, disbursementData);

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
        <div className="grid grid-cols-4 gap-4">
          {benificiaryGroups?.map((benificiaryGroup) => {
            const disbursements = disbursementData?.filter(
              (disbursement) =>
                disbursement.beneficiaryGroupId === benificiaryGroup.uuid,
            );
            let totalAmount = 0;
            disbursements?.map(
              (disbursement) => (totalAmount += disbursement.amount),
            );

            return (
              <div className="cursor-pointer rounded-md border shadow p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-end">
                    <Checkbox
                      onCheckedChange={(e: boolean) => {
                        if (e) {
                          const currentData = stepData.selectedGroups;
                          handleStepDataChange({
                            target: {
                              name: 'selectedGroups',
                              value: [...currentData, benificiaryGroup],
                            },
                          });
                        } else {
                          const currentData = stepData.selectedGroups.filter(
                            (group) => group.uuid !== benificiaryGroup.uuid,
                          );
                          handleStepDataChange({
                            target: {
                              name: 'selectedGroups',
                              value: currentData,
                              benificiaryGroup,
                            },
                          });
                          // const filteredSelected = selectedGroupId.filter(
                          //   (id) => id !== uuid,
                          // );
                          // setSelectedGroupId(filteredSelected);
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
                      {benificiaryGroup._count.groupedBeneficiaries}
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
