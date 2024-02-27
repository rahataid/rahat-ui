import DataCard from '../../components/dataCard';
import type { Metadata } from 'next';
import TransactionTable from '../../components/transactions/transactionTable';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default function TransactionsPage() {
  return (
    <div className="max-h-mx">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>
      <div className=" grid md:grid-cols-4 gap-4">
        <DataCard
          className=""
          title="Cash Issued"
          number={'12'}
          subTitle="To banked beneficiary"
        />
        <DataCard
          className=""
          title="Issued To"
          number={'12'}
          subTitle="Banked Benificiary"
        />
        <DataCard
          className=""
          title="Distributed Beneficiaries"
          number={'$' + 12}
          subTitle="Banked Beneficiary"
        />
        <DataCard
          className=""
          title="Distributed To"
          number={'12'}
          subTitle="To banked beneficiary"
        />
      </div>
      <TransactionTable />
    </div>
  );
}
