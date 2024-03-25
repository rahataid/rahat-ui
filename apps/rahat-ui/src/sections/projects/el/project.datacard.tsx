import React from 'react';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
import {
  useProjectVoucher,
  useBeneficiaryCount,
} from '../../../hooks/el/subgraph/querycall';
import Activities from './projects.activity';

const ProjectDataCard = ({ contractSettings }) => {
  const { data: projectVoucher } = useProjectVoucher(
    contractSettings?.elproject?.address,
    contractSettings?.eyevoucher?.address,
  );

  const { data: beneficiaryDetails } = useBeneficiaryCount(
    contractSettings?.elproject?.address,
  );
  return (
    <>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <div className="grid grid-cols-2 col-span-2 gap-2">
          <DataCard
            className=""
            title="Beneficiary"
            number={beneficiaryDetails?.enrolledBen || '-'}
            subTitle="Enrolled"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Beneficiary"
            number={beneficiaryDetails?.referredBen || '-'}
            subTitle="Referred"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.freeVoucherBudget || '-'}
            subTitle="Free"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.referredVoucherBudget || '-'}
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
