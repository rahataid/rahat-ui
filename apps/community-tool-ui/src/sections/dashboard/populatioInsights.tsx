import React from 'react';
import Donut from './donut';
import BarCharts from './barCharts';
import StackColumn from './stackColum';

type Props = {
  data: any;
};

const PopulationInsights = ({ data }: Props) => {
  const totalBenef =
    data?.data?.find((f) => f.name === 'BENEFICIARY_TOTAL') || ([] as any);
  const beneficiaryGender =
    data?.data?.find((f) => f.name === 'BENEFICIARY_GENDER') || ([] as any);
  const totalByAgeGroup =
    data?.data?.find((f) => f?.name === 'TOTAL_BY_AGEGROUP') || ([] as any);
  return (
    <div>
      <h1 className="text-xl text-primary font-semibold mb-2">
        Population Insights
      </h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 mb-2 ">
        <div className="col-span-1">
          <Donut
            beneficiaryGender={beneficiaryGender}
            totalBeneficiaries={totalBenef?.data?.count}
            title="Total Beneficiaries"
            height={250}
            width={'100%'}
          />
        </div>
        <div className="col-span-2">
          <div className="bg-card shadow rounded h-[calc(100vh-500px)]">
            <p className="mt-2 mb-1 ml-4">Maps</p>
          </div>
        </div>
      </div>

      <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
        <StackColumn
          data={data}
          stacked={true}
          title="Age Groups"
          width={'100%'}
        />
        <BarCharts
          charts={totalByAgeGroup}
          height={320}
          width={'100%'}
          title="Vulnerability Status"
          horizontal={true}
        />
        {/* vulnerability status TODO as props*/}
      </div>
    </div>
  );
};

export default PopulationInsights;
