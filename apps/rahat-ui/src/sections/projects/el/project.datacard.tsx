import React from 'react';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
// import { useProjectVoucher } from '../../../hooks/el/subgraph/querycall';
import Activities from './projects.activity';

const ProjectDataCard = () => {
  // const { data: projectVoucher } = useProjectVoucher(
  //   '0x38BFDCCAc556ED026706EE21b4945cE86718D4D1',
  // );

  return (
    <>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <div className="grid grid-cols-2 col-span-2 gap-2">
          <DataCard
            className=""
            title="Redemmed"
            number={'12'}
            subTitle="Free"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Redemmed"
            number={'12'}
            subTitle="Free"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Redemmed"
            number={'12'}
            subTitle="Free"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Redemmed"
            number={'12'}
            subTitle="Free"
            Icon={Users}
          />
        </div>
        <div className="">
          <Activities title="Vouchers" />
        </div>
      </div>
    </>
  );
};

export default ProjectDataCard;
