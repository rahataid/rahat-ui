'use client';

import { Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import DataCard from '../../components/dataCard';
import TransactionTable from '../../components/transactions/transactionTable';
import { useGraphService } from '../../providers/subgraph-provider';

// export const metadata: Metadata = {
//   title: 'Transactions',
// };

export default function TransactionsPage() {
  const [data, setData] = useState({
    freeVoucherAssigned: '',
    refeeredVoucherAssigned: '',
    freeVoucherClaimed: '',
    refeeredVoucherClaimed: '',
  });

  const { queryService } = useGraphService();

  const fetchVoucherDetails = useCallback(() => {
    const voucherRes = queryService?.useProjectVoucher(
      '0x38BFDCCAc556ED026706EE21b4945cE86718D4D1'
    );
    voucherRes.then((res) => {
      setData({
        ...res,
      });
    });
  }, [queryService]);
  useEffect(() => {
    fetchVoucherDetails();
  }, [fetchVoucherDetails]);

  return (
    <div className="max-h-mx">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>
      <div className=" grid md:grid-cols-4 gap-4">
        <DataCard
          className=""
          title="Voucher Assigned"
          number={data?.freeVoucherAssigned}
          subTitle="Free Voucher"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Voucher Assigned "
          number={data?.refeeredVoucherAssigned}
          subTitle="Referred Voucher"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Voucher Claimed"
          number={data?.freeVoucherClaimed}
          subTitle="Free Voucher"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Voucher Claimed"
          number={data?.refeeredVoucherClaimed}
          subTitle="Referred Voucher"
          Icon={Users}
        />
      </div>
      <TransactionTable />
    </div>
  );
}
