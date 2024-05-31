import React from 'react';
import Donut from './donut';
import BarCharts from './barCharts';

type Props = {
  data: any;
};

const HouseHoldHeadInsights = ({ data }: Props) => {
  const beneficiaryGender =
    data?.data?.find((f) => f.name === 'BENEFICIARY_GENDER') || ([] as any);
  const govtIdTypeStats =
    data?.data.find((f) => f.name === 'GOVT_ID_TYPE_STATS') || {};

  const educationStats =
    data?.data.find((f) => f.name === 'EDUCATION_STATS') || null;

  const houseHoldHeadVulnerabilityStats =
    data?.data?.find((f) => f.name === 'VULNERABILITY_CATEGORY_STATS') || {};
  return (
    <div>
      <h1 className="text-xl text-primary font-semibold mt-2 mb-2">
        Household Head Insights
      </h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-2 mb-2 ">
        <Donut
          donutData={beneficiaryGender}
          title="Gender of Household Head"
          height={250}
          width={'100%'}
        />
        <BarCharts
          charts={houseHoldHeadVulnerabilityStats}
          height={265}
          width={'100%'}
          title=" Household Head Vulnerability Status"
          horizontal={true}
          overFlowProps={true}
          className="col-span-2"
          colors={['#FFC107']}
        />
        <Donut
          donutData={educationStats}
          title="Household Literacy Status"
          height={265}
          width={'100%'}
        />
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-1  gap-2 mb-2 mt-4 ">
        <BarCharts
          charts={govtIdTypeStats}
          height={400}
          width={'100%'}
          title=" Household Head Government Id Type"
        />
      </div>
    </div>
  );
};

export default HouseHoldHeadInsights;
