import { useMemo, useState } from 'react';
import { Button } from 'libs/shadcn/src/components/ui/button';
import { UserRound } from 'lucide-react';
import { NoResult } from 'apps/rahat-ui/src/common';
import {
  PayoutType,
  useFundAssignmentStore,
  useGetBeneficiaryGroup,
  useReserveTokenForGroups,
} from '@rahat-ui/query';
import { useRouter } from 'next/navigation';
import { truncatedText } from 'apps/community-tool-ui/src/utils';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import dynamic from 'next/dynamic';
import type { PayoutFormData } from './assign.payout.form';
import { handleBuildPayoutPayload } from '../utils/utils';
const ErrorInfoPopupModel = dynamic(() => import('./errorInfoPopupModel'));

export default function Confirmation({
  payoutData,
}: {
  payoutData: PayoutFormData | null;
}) {
  // State goes here
  const errorModule = useBoolean();
  const [errorData, setErrorData] = useState(null);

  // Router goes here
  const router = useRouter();

  // Store goes here
  const { assignedFundData } = useFundAssignmentStore((state) => ({
    assignedFundData: state.assignedFundData,
  }));

  const { projectUUID, reserveTokenPayload } = assignedFundData;

  // Query goes here
  const { data: group } = useGetBeneficiaryGroup(
    reserveTokenPayload.beneficiaryGroupId,
  );

  const reserveTokenForGroups = useReserveTokenForGroups();

  // Handlers goes here
  const cardData = useMemo(
    () => [
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
        value: reserveTokenPayload.tokenAmountPerBenef,
      },
      {
        label: 'Total Token Amount',
        value: reserveTokenPayload.numberOfTokens,
      },
    ],
    [group, reserveTokenPayload],
  );

  const benefData = useMemo(
    () =>
      group?.data?.groupedBeneficiaries.map((i: any) => ({
        label: truncatedText(i.Beneficiary.walletAddress, 10),
        value: reserveTokenPayload.tokenAmountPerBenef,
      })),
    [group, reserveTokenPayload.tokenAmountPerBenef],
  );

  const payoutPayload = useMemo(
    () => handleBuildPayoutPayload(payoutData),
    [payoutData],
  );

  const handleSubmit = async () => {
    const payload = {
      ...reserveTokenPayload,
      totalTokensReserved: reserveTokenPayload.numberOfTokens,
      ...(payoutPayload && { params: payoutPayload }),
    };

    try {
      const data = await reserveTokenForGroups.mutateAsync({
        projectUUID,
        reserveTokenPayload: payload,
      });

      if (data?.status === 'error') {
        errorModule.onTrue();
        setErrorData(data);
        return;
      }

      router.push(
        `/projects/aa/${projectUUID}/fund-management?tab=fundManagementList`,
      );
    } catch (e) {
      console.error('Creating reserve token::', e);
    }
  };

  return (
    <div className="p-2">
      <ErrorInfoPopupModel validateModal={errorModule} errorData={errorData} />
      <div className="flex gap-3 mb-3">
        <div className="w-[60%] p-3 rounded-md bg-gray-50">
          <p className="font-semibold text-sm mb-2">Fund Assignment</p>
          <div className="flex flex-col space-y-2">
            {cardData.map((i) => (
              <div key={i.label}>
                <p className="text-sm text-muted-foreground">{i.label}</p>
                <p className="text-lg font-semibold text-primary">{i.value}</p>
              </div>
            ))}
          </div>
          {payoutData && payoutData.method && (
            <div className="mt-3 pt-3 border-t">
              <p className="font-semibold text-sm mb-2">Payout Details</p>
              <div className="flex flex-col space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Method</p>
                  <p className="text-base font-semibold text-primary">
                    {payoutData.method}
                  </p>
                </div>
                {payoutData.method != 'FSP' && (
                  <div>
                    <p className="text-sm text-muted-foreground">Mode</p>
                    <p className="text-base font-semibold text-primary">
                      {payoutData.mode}
                    </p>
                  </div>
                )}
                {payoutData.vendor?.name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor</p>
                    <p className="text-base font-semibold text-primary">
                      {payoutData.vendor.name}
                    </p>
                  </div>
                )}
                {payoutData.paymentProvider?.name && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Provider
                    </p>
                    <p className="text-base font-semibold text-primary">
                      {payoutData.paymentProvider.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-[40%] p-3 rounded-md bg-gray-50">
          <p className="font-semibold text-sm mb-2">
            Beneficiaries List
            {benefData?.length ? (
              <span className="text-muted-foreground font-normal ml-1">
                ({benefData.length})
              </span>
            ) : null}
          </p>
          <div className="flex flex-col divide-y">
            {benefData?.length > 0 ? (
              benefData?.map((i: any) => (
                <div
                  key={i.label}
                  className="flex justify-between items-center py-1.5"
                >
                  <div className="font-medium text-sm flex space-x-2 items-center">
                    <UserRound className="h-4 w-4" />
                    <p>{i.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    + {i.value}
                  </p>
                </div>
              ))
            ) : (
              <NoResult message="No Beneficiary found" />
            )}
          </div>
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
          <Button
            className="px-10"
            onClick={handleSubmit}
            disabled={reserveTokenForGroups.isPending}
          >
            {reserveTokenForGroups.isPending ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
