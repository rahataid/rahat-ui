import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import RecentPaymentCard from './recent.payment.card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';

const RecentPayout = () => {
  const route = useRouter();
  const recentPayments = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    beneficiaryGroupName: 'Rumsan Beneficiary Group',
    actions: 'FSP',
    merchentName: 'NIC Asia',
    beneficiariesCount: 25 + i, // just to slightly vary the data
    dateTime: '21 July, 2025, 00:12:35 PM',
  }));
  return (
    <>
      <div className="flex justify-between mb-2">
        <h1 className="text-lg font-medium">Recent Payout</h1>
        <Button
          // className={className}
          variant={'link'}
          onClick={() => route.push('#')}
        >
          View all Transactions
          <ArrowRight className="ml-1" size={14} strokeWidth={1.5} />
        </Button>
      </div>

      <div className="h-[calc(100vh-400px)] overflow-y-scroll overflow-x-hidden scrollbar-hidden">
        {recentPayments.map((payment, index) => (
          <div key={payment.id}>
            <RecentPaymentCard
              beneficiaryGroupName={payment.beneficiaryGroupName}
              actions={payment.actions}
              merchentName={payment.merchentName}
              beneficiariesCount={payment.beneficiariesCount}
              dateTime={payment.dateTime}
              onView={() => console.log(`View clicked for card ${index + 1}`)}
            />
            {index < recentPayments.length - 1 && (
              <Separator className="mt-2 mb-2" />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default RecentPayout;
