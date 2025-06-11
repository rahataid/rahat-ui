import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import RecentPaymentCard from './recent.payment.card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { NoResult } from 'apps/rahat-ui/src/common';

interface RecentPayoutProps {
  payouts: Array<Record<string, any>>;
}

const RecentPayout = ({ payouts }: RecentPayoutProps) => {
  const { id } = useParams();
  const route = useRouter();
  return (
    <>
      <div className="flex justify-between mb-2">
        <h1 className="text-lg font-medium">Recent Payout</h1>
        <Button
          variant={'link'}
          onClick={() => route.push(`/projects/aa/${id}/payout/list`)}
          disabled={!payouts?.length}
        >
          View all Transactions
          <ArrowRight className="ml-1" size={14} strokeWidth={1.5} />
        </Button>
      </div>

      <div className="h-[calc(100vh-400px)] overflow-y-scroll overflow-x-hidden scrollbar-hidden">
        {payouts?.length ? (
          payouts?.map((item, index) => (
            <div key={item.id}>
              <RecentPaymentCard
                beneficiaryGroupName={
                  item?.beneficiaryGroupToken?.beneficiaryGroup?.name
                }
                actions={item?.type}
                merchentName={item?.extras?.paymentProviderName ?? 'N/A'}
                beneficiariesCount={
                  item?.beneficiaryGroupToken?.beneficiaryGroup?._count
                    ?.beneficiaries
                }
                dateTime={new Date(item?.updatedAt)?.toLocaleString()}
                onView={() =>
                  route.push(`/projects/aa/${id}/payout/details/${item?.uuid}`)
                }
              />
              {index < payouts.length - 1 && (
                <Separator className="mt-2 mb-2" />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm font-medium text-muted-foreground">
            No payouts found
          </p>
        )}
      </div>
    </>
  );
};

export default RecentPayout;
