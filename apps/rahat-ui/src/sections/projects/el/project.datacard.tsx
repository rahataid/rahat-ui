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
    '0x1b4d9fa12f3e1b1181b413979330c0aff9bbaae5',
    '0xc8a8032fc777b9ad39c57a0ebabbfa0b630825a0',
    '0xd7f992c60f8fde06df0b93276e2e43eb6555a5fa',
  );

  const { data: beneficiaryDetails } = useBeneficiaryCount(
    '0x1b4d9fa12f3e1b1181b413979330c0aff9bbaae5',
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
