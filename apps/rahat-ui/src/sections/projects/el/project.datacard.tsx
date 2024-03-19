import React from 'react';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
import {
  useProjectVoucher,
  useBeneficiaryCount,
} from '../../../hooks/el/subgraph/querycall';
import Activities from './projects.activity';

const ProjectDataCard = () => {
  const { data: projectVoucher } = useProjectVoucher(
    '0x9C8Ee9931BEc18EA883c8F23c7427016bBDeF171',
  );

  const { data: beneficiaryDetails } = useBeneficiaryCount(
    '0x9C8Ee9931BEc18EA883c8F23c7427016bBDeF171',
  );
  return (
    <>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <div className="grid grid-cols-2 col-span-2 gap-2">
          <DataCard
            className=""
            title="Beneficiary"
            number={beneficiaryDetails?.enrolledBen}
            subTitle="Enrolled"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Beneficiary"
            number={beneficiaryDetails?.referredBen}
            subTitle="Referred"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.freeVoucherBudget}
            subTitle="Free"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.refeeredVoucherBudget}
            subTitle="Discount"
            Icon={Users}
          />
        </div>
        <div className="">
          <Activities title="Vouchers" data={projectVoucher} />
        </div>
      </div>
    </>
  );
};

export default ProjectDataCard;
