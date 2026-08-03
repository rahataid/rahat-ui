import { useMemo, useState } from 'react';
import { Button } from 'libs/shadcn/src/components/ui/button';
import { UserRound } from 'lucide-react';
import { NoResult } from 'apps/rahat-ui/src/common';
import { useTranslations } from 'next-intl';
import {
  useFundAssignmentStore,
  useGetBeneficiaryGroup,
  useReserveTokenForGroups,
} from '@rahat-ui/query';
import { useRouter } from 'next/navigation';
import { truncatedText } from 'apps/community-tool-ui/src/utils';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import dynamic from 'next/dynamic';
import { FundWithPayoutSchema } from 'apps/rahat-ui/src/sections/projects/aa-2/payout/initiatePayout/schemas/payout.validation';
import { handleBuildPayoutPayload } from 'apps/rahat-ui/src/sections/projects/aa-2/fundManagement/utils/utils';

const ErrorInfoPopupModel = dynamic(() => import('./errorInfoPopupModel'));
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function Confirmation({
  payoutData,
  onPayoutData,
}: {
  payoutData: FundWithPayoutSchema | null;
  onPayoutData: (data: FundWithPayoutSchema | null) => void;
}) {
  const t = useTranslations('AA_PROJECT');
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
  const formatNum = useNumberFormat();

  // Handlers goes here
  const cardData = useMemo(
    () => [
      { label: t('TITLE'), value: reserveTokenPayload.title },
      {
        label: t('BENEFICIARY_GROUP_NAME'),
        value: reserveTokenPayload.beneficiaryName,
      },
      {
        label: t('TOTAL_BENEFICIARIES2'),
        value: group?.data?.groupedBeneficiaries.length,
      },
      {
        label: t('TOKEN_ASSIGNED_PER_BENEFICIARY'),
        value: reserveTokenPayload.tokenAmountPerBenef,
      },
      {
        label: t('TOTAL_TOKEN_AMOUNT_LABEL'),
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

  const handleSubmit = async () => {
    // Created a helper to build the payload on submit
    const payoutPayload = handleBuildPayoutPayload(payoutData);
    const payload = {
      ...reserveTokenPayload,
      totalTokensReserved: reserveTokenPayload.numberOfTokens,
      isPayoutIntegrated: !!payoutData?.method && !!payoutData?.mode,
      ...(payoutPayload && { params: payoutPayload }),
    };

    try {
      const data = await reserveTokenForGroups.mutateAsync({
        projectUUID,
        reserveTokenPayload: payload,
      });

      if (data?.isAssignable === false) {
        errorModule.onTrue();
        setErrorData(data);
        return;
      }

      // Clear payout state and navigate, store is cleared when AssignFundsView unmounts
      onPayoutData(null);
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
          <p className="font-semibold text-sm mb-2">{t('FUND_ASSIGNMENT')}</p>
          <div className="flex flex-col space-y-2">
            {cardData.map((i) => (
              <div key={i.label}>
                <p className="text-sm text-muted-foreground">{i.label}</p>
                <p className="text-lg font-semibold text-primary">{formatNum(i.value)}</p>
              </div>
            ))}
          </div>
          {payoutData && payoutData.method && (
            <div className="mt-3 pt-3 border-t">
              <p className="font-semibold text-sm mb-2">{t('PAYOUT_DETAILS')}</p>
              <div className="flex flex-col space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t('METHOD')}</p>
                  <p className="text-base font-semibold text-primary">
                    {payoutData.method}
                  </p>
                </div>
                {payoutData.method != 'FSP' && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t('MODE')}</p>
                    <p className="text-base font-semibold text-primary">
                      {payoutData.mode}
                    </p>
                  </div>
                )}
                {payoutData.vendor?.name && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t('VENDOR_LABEL')}</p>
                    <p className="text-base font-semibold text-primary">
                      {payoutData.vendor.name}
                    </p>
                  </div>
                )}
                {payoutData.paymentProvider?.name && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('PAYMENT_PROVIDER')}
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
            {t('BENEFICIARIES_LIST')}
            {benefData?.length ? (
              <span className="text-muted-foreground font-normal ml-1">
                ({formatNum(benefData.length)})
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
                    + {formatNum(i.value)}
                  </p>
                </div>
              ))
            ) : (
              <NoResult message={t('NO_BENEFICIARY_FOUND')} />
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex space-x-2 rounded-lg p-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          {t('CANCEL')}
        </Button>
        <Button
          className="px-10"
          onClick={handleSubmit}
          disabled={reserveTokenForGroups.isPending}
        >
          {reserveTokenForGroups.isPending ? t('CONFIRMING') : t('CONFIRM')}
        </Button>
      </div>
    </div>
  );
}
