'use client';

import { Button } from 'libs/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Loader2, UserRound } from 'lucide-react';
import { useAssignGroupInkind, useGetBeneficiaryGroup } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { truncatedText } from 'apps/community-tool-ui/src/utils';
import { NoResult } from 'apps/rahat-ui/src/common';

interface AssignInkindSummary {
  inkindId: string;
  groupId: string;
  inkindName: string;
  groupName: string;
  availableStock: number;
  beneficiaryCount: number;
}

interface Props {
  formData: AssignInkindSummary;
  onBack: () => void;
  onSuccess: () => void;
}

export default function AssignInkindConfirmation({
  formData,
  onBack,
  onSuccess,
}: Props) {
  const { id } = useParams();
  const projectUUID = id as UUID;
  const assignGroupInkind = useAssignGroupInkind(projectUUID);

  const group = useGetBeneficiaryGroup(formData.groupId as UUID);
  // API returns { success, data: { groupedBeneficiaries } }
  // group.data = the axios response body
  const rawData = group?.data;
  const beneficiaries: any[] =
    rawData?.data?.groupedBeneficiaries ?? // { success, data: { groupedBeneficiaries } }
    rawData?.groupedBeneficiaries ?? // { groupedBeneficiaries } (unwrapped)
    [];

  const cardData = [
    { label: 'In-Kind Item', value: formData.inkindName },
    { label: 'Beneficiary Group', value: formData.groupName },
    { label: 'Available Stock', value: formData.availableStock },
    { label: 'Beneficiaries', value: formData.beneficiaryCount },
    {
      label: 'Stock After Assignment',
      value: formData.availableStock - formData.beneficiaryCount,
    },
  ];

  const handleSubmit = async () => {
    try {
      await assignGroupInkind.mutateAsync({
        groupId: formData.groupId,
        inkindId: formData.inkindId,
      });
      onSuccess();
    } catch {
      // Error handled by the mutation's onError toast
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] p-2">
      <div className="flex gap-3 flex-1 min-h-0 mb-3">
        {/* Left: Summary card */}
        <div className="w-[60%] p-4 rounded-md bg-gray-50 flex flex-col space-y-4 overflow-y-auto">
          <p className="font-semibold text-sm mb-1">Assignment Summary</p>
          {cardData.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold text-primary">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Right: Beneficiary list */}
        <div className="w-[40%] p-4 rounded-md bg-gray-50 flex flex-col min-h-0">
          <p className="font-semibold text-sm mb-2">
            Beneficiaries List ({beneficiaries.length})
          </p>
          {group.isLoading || group.isFetching ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : beneficiaries.length === 0 ? (
            <NoResult message="No beneficiaries found" size="small" />
          ) : (
            <div className="flex flex-col divide-y overflow-y-auto flex-1">
              {beneficiaries.map((i: any) => (
                <div
                  key={i.Beneficiary?.walletAddress}
                  className="flex items-center gap-2 py-1.5 shrink-0"
                >
                  <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {truncatedText(i.Beneficiary?.walletAddress ?? '', 10)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-3 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={assignGroupInkind.isPending}
        >
          Back
        </Button>
        <Button
          className="px-10 rounded-sm"
          onClick={handleSubmit}
          disabled={assignGroupInkind.isPending}
        >
          {assignGroupInkind.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            'Assign InKinds'
          )}
        </Button>
      </div>
    </div>
  );
}
