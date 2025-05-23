import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { HeartHandshake, Home, Users } from 'lucide-react';

const CommunicationSummary = (statsData: any, isLoading: boolean) => {
  return (
    <div className=" grid md:grid-cols-3 gap-2 mb-2">
      <DataCard
        className=""
        title="Total Campaign Sent"
        number={statsData?.statsData?.total || 'N/A'}
        Icon={Users}
      />
      <DataCard
        className=""
        title="Successful Campaign"
        number={statsData?.statsData?.success || 'N/A'}
        Icon={Home}
      />
      <DataCard
        className=""
        title="Failed Campaign"
        number={statsData?.statsData?.failed || 'N/A'}
        Icon={HeartHandshake}
      />
    </div>
  );
};

export default CommunicationSummary;
