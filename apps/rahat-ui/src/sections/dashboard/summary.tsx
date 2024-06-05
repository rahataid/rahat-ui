import { BadgeCent, HeartHandshake, Home, Users } from 'lucide-react';
import DataCard from '../../components/dataCard';

const DashboardSummary = ({ data }: { data: any }) => {
  const {beneficiaryStats,vendorStats} = data
  const beneficiaryTotal = beneficiaryStats?.data?.data?.find(
    (item) => item.name === 'BENEFICIARY_TOTAL',
  );
  const vendorTotal = vendorStats?.data?.data;
  const count = beneficiaryTotal ? beneficiaryTotal?.data?.count : 0;

  return (
    <div>
      <div className=" grid md:grid-cols-4 gap-2">
        <DataCard
          className=""
          title="Total beneficiaries"
          number={count}
          Icon={Users}
        />
        <DataCard
          className=""
          title="Total  Vendors"
          number={vendorTotal}
          Icon={Users}
        />
        {/* <DataCard
          className=""
          title="Amount Distributed"
          number={'₹' + ' 1,80,000'}
          subTitle="+40% from last month"
          Icon={HeartHandshake}
        />
        <DataCard
          className=""
          title="Total Donations"
          number={'$' + 12}
          subTitle="$35% from last month"
          Icon={BadgeCent}
        /> */}
      </div>
    </div>
  );
};

export default DashboardSummary;
