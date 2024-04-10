import { BadgeCent, HeartHandshake, Home, Users } from 'lucide-react';
import DataCard from '../../components/dataCard';

const DashboardSummary = ({
  totalBeneficiaries,
}: {
  totalBeneficiaries: any;
}) => {
  return (
    <div>
      <div className=" grid md:grid-cols-4 gap-4">
        <DataCard
          className=""
          title="Total beneficiaries"
          number={totalBeneficiaries ? totalBeneficiaries : 0}
          subTitle="+20% from last month"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Communities Impacted"
          number={'122'}
          subTitle="+60% from last month"
          Icon={Home}
        />
        <DataCard
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
        />
      </div>
    </div>
  );
};

export default DashboardSummary;
