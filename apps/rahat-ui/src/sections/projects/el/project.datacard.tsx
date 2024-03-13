import React from 'react';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
// import { useProjectVoucher } from '../../../hooks/el/subgraph/querycall';

const ProjectDataCard = () => {
  // const { data: projectVoucher } = useProjectVoucher(
  //   '0x38BFDCCAc556ED026706EE21b4945cE86718D4D1',
  // );

  return (
    <>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <DataCard
          className=""
          title="Beneficiaries"
          number1={'12'}
          subTitle1="Enrolled"
          number2={'12'}
          subTitle2="Referred"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Voucher Details"
          number1={'12'}
          subTitle1="Free"
          number2={'12'}
          subTitle2="Discount"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Redemmed"
          number1={'12'}
          subTitle1="Free"
          number2={'12'}
          subTitle2="Discount"
          Icon={Users}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <DataCard
          className=""
          title="Eye Checkup Details"
          number1={'12'}
          subTitle1="Checked Glasses Required"
          number2={'12'}
          subTitle2="Checked Glasses Not Required"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Discount Voucher Details"
          number1={'12'}
          subTitle1="Glasses Bought"
          number2={'12'}
          subTitle2="Glasses Not Bought"
          Icon={Users}
        />
      </div>
    </>
  );
};

export default ProjectDataCard;
