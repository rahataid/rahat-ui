import { Home, HomeIcon } from 'lucide-react';
import DataCard from '../../components/dataCard';
import BarCharts from './barCharts';
import Charts from './charts ';

type Props = {
  data: any;
};

const HouseHoldInsights = ({ data }: Props) => {
  const casteStats =
    data?.data?.find((f) => f.name === 'CASTE_STATS') || ([] as any);

  const bankedStatus =
    data?.data?.find((f) => f.name === 'BENEFICIARY_BANKEDSTATUS') ||
    ([] as any);

  const phoneStatus =
    data?.data?.find((f) => f.name === 'BENEFICIARY_PHONESTATUS') ||
    ([] as any);

  const bankNameStatus =
    data?.data.find((f) => f.name === 'BANK_NAME_STATS') || ([] as any);

  return (
    <div className="mt-3">
      <h1 className="text-xl text-primary font-semibold mb-2">
        Household Insights
      </h1>
      <div className=" grid sm:grid-cols-1 md:grid-cols-4 gap-4 my-4 ">
        <DataCard
          className=""
          title="Total Households"
          number={'25'}
          subTitle="+20% from last month"
          Icon={Home}
        />
        <DataCard
          className=""
          title="Total Vulnerable Households"
          number={'122'}
          subTitle="+60% from last month"
          Icon={HomeIcon}
          iconcolor="red"
        />
      </div>
      <Charts charts={[casteStats, bankedStatus, phoneStatus]} />
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
        <BarCharts
          charts={bankNameStatus}
          height={2400}
          width={'100%'}
          overFlowProps={true}
          title="Benniciary Associated Bank"
          horizontal={true}
        />
        <div className="bg-card shadow rounded  ">
          <p className="mt-2 mb-1 ml-4">
            House with Family members qualified for SSA not recieved
          </p>
        </div>
      </div>
    </div>
  );
};

export default HouseHoldInsights;
