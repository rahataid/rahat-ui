import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { BadgeCent, HeartHandshake, Home, Users } from 'lucide-react';

const CommunicationSummary = ({}) => {
  return (
    <div className=" grid md:grid-cols-3 gap-2 mb-2">
      <DataCard
        className=""
        title="Total beneficiaries"
        number={'12'}
        subTitle="+2% from last month"
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
    </div>
  );
};

export default CommunicationSummary;
