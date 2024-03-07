import DataCard from '../../components/dataCard';
import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import ProjectTransactionTable from './projectDetailTransactionTable';
import ProjectDetailTransactionTable from './projectDetailTransactionTable';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default function ProjectDetailTransactionView() {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>
      <div className=" grid md:grid-cols-4 gap-4">
        <DataCard
          className=""
          title="Cash Issued"
          number={'12'}
          subTitle="To banked beneficiary"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Issued To"
          number={'12'}
          subTitle="Banked Benificiary"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Distributed Beneficiaries"
          number={'$' + 12}
          subTitle="Banked Beneficiary"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Distributed To"
          number={'12'}
          subTitle="To banked beneficiary"
          Icon={Users}
        />
      </div>
      <ProjectDetailTransactionTable />
    </div>
  );
}
