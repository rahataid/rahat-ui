'use client';

import { Users } from 'lucide-react';
import DataCard from '../../components/dataCard';
import TransactionTable from '../../components/transactions/transactionTable';
import {useProjectVoucher } from '../../hooks/el/subgraph/querycall';

// export const metadata: Metadata = {
//   title: 'Transactions',
// };

export default function TransactionsPage() {
  const {data:transactionData,error} = useProjectVoucher('0x38BFDCCAc556ED026706EE21b4945cE86718D4D1');

  return (
    <div className="max-h-mx">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>
      {/* Data Cards */}
      <div className=" grid md:grid-cols-4 gap-4">
        <DataCard
          className="border-green-500"
          title="Free Voucher Assigned"
          number1={transactionData?.freeVoucherAssigned}
          subTitle1="To Enrolled Beneficiary"
          number2={''}
          subTitle2=""
          Icon={Users}
        />
        <DataCard
          className="border-yellow-500"
          title="Free Vouchers Redeemed"
          number1={transactionData?.freeVoucherClaimed}
          subTitle1="By Enrolled Beneficiary"
          number2={''}
          subTitle2=""
          Icon={Users}
        />
        <DataCard
          className="border-yellow-500"
          title="Discount Vouchers Referred"
          number1={transactionData?.refeeredVoucherAssigned}
          subTitle1="To Referred Beneficiaries"
          number2={''}
          subTitle2=""
          Icon={Users}
        />
        <DataCard
          className="border-green-500"
          title="Discount Voucher Redeemed"
          number1={transactionData?.refeeredVoucherClaimed}
          subTitle1="Referred Beneficiaries"
          number2={''}
          subTitle2=""
          Icon={Users}
        />
      </div>
      <TransactionTable />
    </div>
  );
}
