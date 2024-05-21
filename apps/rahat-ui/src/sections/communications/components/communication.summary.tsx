import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { BadgeCent, HeartHandshake, Home, Users } from 'lucide-react';

const CommunicationSummary = (statsData:any,isLoading:boolean) => {
  return (
      <div className=" grid md:grid-cols-3 gap-2 mb-2">
      <DataCard
        className=""
        title="Total Message Sent"
        number={statsData?.statsData?.total}
        subTitle=""
        Icon={Users}
      />
      <DataCard
        className=""
        title="Successful Messages"
        number={statsData?.statsData?.success}
        subTitle=""
        Icon={Home}
      />
      <DataCard
        className=""
        title="Failed Messages"
        number={statsData?.statsData?.failed}
        subTitle=""
        Icon={HeartHandshake}
      />
    </div>
  );
};

export default CommunicationSummary;
