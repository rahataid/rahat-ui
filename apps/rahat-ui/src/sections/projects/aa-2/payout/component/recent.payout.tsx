import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import RecentPaymentCard from './recent.payment.card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { NoResult } from 'apps/rahat-ui/src/common';

interface RecentPayoutProps {
  payouts: Array<Record<string, any>>;
}

const RecentPayout = ({ payouts }: RecentPayoutProps) => {
  const t = useTranslations('AA_PROJECT');
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const { id } = useParams();
  const route = useRouter();
  return (
    <>
      <div className="flex justify-between mb-2">
        <h1 className="text-lg font-medium">{tv('RECENT_PAYOUT')}</h1>
      </div>

      <div className="h-[calc(100vh-400px)] overflow-y-scroll overflow-x-hidden scrollbar-hidden">
        {payouts?.length ? (
          payouts?.map((item, index) => (
            <div key={item.id}>
              <RecentPaymentCard
                status={item.status}
                vendorName={item?.extras?.vendorName}
                beneficiaryGroupName={
                  item?.beneficiaryGroupToken?.beneficiaryGroup?.name
                }
                actions={item?.type === 'VENDOR' ? 'CVA' : item?.type}
                merchentName={
                  item?.type === 'FSP'
                    ? item?.extras?.paymentProviderName.split('_').join(' ')
                    : item?.mode
                }
                beneficiariesCount={
                  item?.beneficiaryGroupToken?.beneficiaryGroup?._count
                    ?.beneficiaries
                }
                dateTime={item?.updatedAt}
                onView={() =>
                  route.push(
                    `/projects/aa/${id}/payout/details/${item?.uuid}?from=payoutOverview`,
                  )
                }
              />
              {index < payouts.length - 1 && (
                <Separator className="mt-2 mb-2" />
              )}
            </div>
          ))
        ) : (
          <NoResult message={t('NO_PAYOUT_AVAILABLE')} />
        )}
      </div>
    </>
  );
};

export default RecentPayout;
