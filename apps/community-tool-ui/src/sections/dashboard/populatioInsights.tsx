import BarCharts from './barCharts';
import Donut from './donut';
import CommunityMap from './map';
import StackColumn from './stackColum';

type Props = {
  data: any;
};

const PopulationInsights = ({ data }: Props) => {
  const totalBenef =
    data?.data?.find((f) => f.name === 'BENEFICIARY_TOTAL') || ([] as any);
  const totalGender =
    data?.data?.find((f) => f.name === 'TOTAL_WITH_GENDER') || ([] as any);
  const vulnerabilityStatus =
    data?.data?.find((f) => f?.name === 'VULNERABIILTY_STATUS') || ([] as any);

    const benefMapStats =
    data?.data?.find((f) => f?.name === "BENEFICIARY_MAP_STATS") || ([] as any);

    const filtered = benefMapStats && benefMapStats.data ? benefMapStats.data.filter(b => {
      return b.latitude && b.longitude
    }) : [];

  return (
    <div>
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-2 mb-2 ">
        <Donut
          donutData={totalGender}
          totalBeneficiaries={totalBenef?.data?.count || 0}
          title="Total Beneficiaries"
          height={250}
          width={'100%'}
        />
        <CommunityMap coordinates={ filtered } />
      </div>

      <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
        <StackColumn
          data={data}
          stacked={true}
          title="Age Groups"
          width={'100%'}
          height={240}
        />
        <BarCharts
          overFlowProps={true}
          charts={vulnerabilityStatus}
          height={240}
          width={'100%'}
          title="Vulnerability Status"
          horizontal={true}
          colors={['#FFC107']}
        />
      </div>
    </div>
  );
};

export default PopulationInsights;
