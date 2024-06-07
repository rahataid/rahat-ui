import { Home, HomeIcon } from 'lucide-react';
import DataCard from '../../components/dataCard';
import BarCharts from './barCharts';
import Charts from './charts ';

type Props = {
  data: any;
};

const HouseHoldInsights = ({ data }: Props) => {
  const totalBenef =
    data?.data?.find((f) => f.name === 'BENEFICIARY_TOTAL') || [];
  const totalVulnerableHousehold =
    data?.data?.find((f) => f.name === 'TOTAL_VULNERABLE_HOUSEHOLD') || [];
  const chartData = [];
  const casteStats = data?.data?.find((f) => f.name === 'CASTE_STATS') || null;

  const typeofSSANotRecived =
    data?.data?.find((f) => f.name === 'SSA_NOT_RECEIVED_STATS') || {};
  const bankNameStatus =
    data?.data.find((f) => f.name === 'BANK_NAME_STATS') || {};

  const typeofPhone =
    data?.data?.find((f) => f.name === 'PHONE_TYPE_STATS') || null;

  const bankStatus =
    data?.data?.find((f) => f.name === 'BENEFICIARY_BANK_STATS') || null;

  const phoneAvailibility =
    data?.data?.find((f) => f.name === 'BENEFICIARY_PHONE_STATS') || null;
  if (casteStats) chartData.push(casteStats);
  if (typeofPhone) chartData.push(typeofPhone);
  if (bankStatus) chartData.push(bankStatus);
  if (phoneAvailibility) chartData.push(phoneAvailibility);
  return (
    <div className="mt-3">
      <h1 className="text-xl text-primary font-semibold mb-2">
        Household Insights
      </h1>
      <div className=" grid sm:grid-cols-1 md:grid-cols-4 gap-4 my-4 ">
        <DataCard
          className=""
          title="Total Households"
          number={totalBenef?.data?.count || 0}
          Icon={Home}
        />
        <DataCard
          className=""
          title="Total Vulnerable Households"
          number={totalVulnerableHousehold?.data?.count || 0}
          Icon={HomeIcon}
          iconcolor="red"
        />
      </div>
      <Charts charts={chartData} />
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
        <BarCharts
          charts={bankNameStatus}
          height={400}
          width={'100%'}
          overFlowProps={true}
          title="Beneficiary Associated Bank"
          horizontal={true}
        />

        <BarCharts
          charts={typeofSSANotRecived}
          height={240}
          width={'100%'}
          overFlowProps={true}
          title="Households with family members qualified for SSA but not received"
          horizontal={true}
          colors={['#FFC107']}
        />
      </div>
    </div>
  );
};

export default HouseHoldInsights;
