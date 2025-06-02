import React from 'react';
import { Button } from 'libs/shadcn/src/components/ui/button';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { UserRound } from 'lucide-react';
import { HeaderWithBack, NoResult } from 'apps/rahat-ui/src/common';
import {
  useFundAssignmentStore,
  useGetBeneficiaryGroup,
  useReserveTokenForGroups,
} from '@rahat-ui/query';
import { useRouter } from 'next/navigation';
import { truncatedText } from 'apps/community-tool-ui/src/utils';

export default function Confirmation() {
  const router = useRouter();
  const { assignedFundData } = useFundAssignmentStore((state) => ({
    assignedFundData: state.assignedFundData,
  }));

  const { projectUUID, reserveTokenPayload } = assignedFundData;

  const { data: group } = useGetBeneficiaryGroup(
    reserveTokenPayload.beneficiaryGroupId,
  );

  const reserveTokenForGroups = useReserveTokenForGroups();
  const cardData = [
    { label: 'Title', value: reserveTokenPayload.title },
    {
      label: 'Beneficiary Group Name',
      value: reserveTokenPayload.beneficiaryName,
    },
    {
      label: 'Total Beneficiaries',
      value: group?.data?.groupedBeneficiaries.length,
    },
    {
      label: 'Token Assigned Per Beneficiary',
      value: reserveTokenPayload.numberOfTokens,
    },
    {
      label: 'Total Token Amount',
      value:
        group?.data?.groupedBeneficiaries.length *
        reserveTokenPayload.numberOfTokens,
    },
  ];

  const benefData = group?.data?.groupedBeneficiaries.map((i: any) => ({
    label: truncatedText(i.Beneficiary.walletAddress, 10),
    value: reserveTokenPayload.numberOfTokens,
  }));

  const handleSubmit = async () => {
    reserveTokenPayload.totalTokensReserved = cardData[4].value;
    try {
      await reserveTokenForGroups.mutateAsync({
        projectUUID,
        reserveTokenPayload,
      });
      router.push(`/projects/aa/${projectUUID}/fund-management`);
    } catch (e) {
      console.error('Creating reserve token::', e);
    }
  };
  return (
    <div className="p-4">
      <HeaderWithBack
        path={``}
        title="Confirmation"
        subtitle="Check the details below and confirm to proceed"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-md bg-gray-50">
          <div className="flex flex-col space-y-4">
            {cardData.map((i) => (
              <div key={i.label}>
                <p className="text-sm font-medium">{i.label}</p>
                <p className="text-lg font-semibold text-primary">{i.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-md bg-gray-50">
          <p className="font-semibold text-lg mb-4">Beneficiaries List</p>
          <ScrollArea className="h-[calc(300px)] pr-4">
            <div className="flex flex-col space-y-4">
              {benefData?.length > 0 ? (
                benefData?.map((i) => (
                  <div
                    key={i.label}
                    className="flex justify-between items-center space-x-4"
                  >
                    <div className="font-medium text-sm/6 flex space-x-2 items-center">
                      <UserRound />
                      <p>{i.label}</p>
                    </div>
                    <p>+ {i.value}</p>
                  </div>
                ))
              ) : (
                <NoResult message="No Beneficiary found" />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button className="px-10" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
