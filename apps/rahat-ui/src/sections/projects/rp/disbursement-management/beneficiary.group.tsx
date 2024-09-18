import React, { useEffect } from 'react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  useCreateDisbursement,
  useFindAllBeneficiaryGroups,
  useGetBeneficiariesDisbursements,
  useRpSingleBeneficiaryGroupMutation,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import BeneficiaryCard from './select.beneficiary.card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

import GroupDisbursementAssignModel from './group-assign-disbursement-amount.modal';

const BeneficiaryGroup = () => {
  const { id } = useParams();

  const { data: benificiaryGroups } = useFindAllBeneficiaryGroups(id as UUID);
  const groupId = benificiaryGroups?.map(
    (benificiaryGroup) => benificiaryGroup?.uuid,
  );
  console.log(benificiaryGroups, groupId);

  const { data: benificiaryDisbursement, refetch } =
    useGetBeneficiariesDisbursements(id as UUID, groupId || []);
  const createDisbursement = useCreateDisbursement(id as UUID);
  const beneficiaryGroup = useRpSingleBeneficiaryGroupMutation(id as UUID);

  const [selectedGroupId, setSelectedGroupId] = React.useState([]);
  const [disbursementData, setDisbursementData] = React.useState([]);

  useEffect(() => {
    if (benificiaryDisbursement) {
      setDisbursementData(benificiaryDisbursement);
    }
  }, [benificiaryDisbursement]);

  const handleCreateDisbursement = async (
    amount: number,
    groupUUid: string,
  ) => {
    const bg = await beneficiaryGroup.mutateAsync(groupUUid as UUID);
    await Promise.all(
      bg?.groupedBeneficiaries?.map(
        async (groupedBeneficiary: any) =>
          await createDisbursement.mutateAsync({
            amount: +amount,
            walletAddress: groupedBeneficiary?.Beneficiary?.walletAddress,
          }),
      ),
    );
    refetch();
  };
  return (
    <div>
      <div className="flex flex-col justify-between  gap-2 py-4">
        <div className="flex">
          <Input
            placeholder="Search Beneficiaries"
            className="rounded-md mr-2"
          />
          <GroupDisbursementAssignModel
            bulk={true}
            selectedGroupId={selectedGroupId}
            handleSubmit={handleCreateDisbursement}
          />
        </div>
        <ScrollArea className="h-[calc(100vh-538px)]">
          <div className="grid grid-cols-4 gap-4 m-4">
            {benificiaryGroups?.map((group: any) => {
              const disbursements = disbursementData?.filter(
                (disbursement) =>
                  disbursement.beneficiaryGroupId === group.uuid,
              );
              let totalAmount = 0;
              disbursements?.map(
                (disbursement) => (totalAmount += disbursement.amount),
              );
              return (
                <BeneficiaryCard
                  name={group.name}
                  uuid={group.uuid}
                  totalBeneficiary={group._count.groupedBeneficiaries}
                  handleCreateDisbursement={handleCreateDisbursement}
                  setSelectedGroupId={setSelectedGroupId}
                  selectedGroupId={selectedGroupId}
                  totalAmount={totalAmount}
                />
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BeneficiaryGroup;
