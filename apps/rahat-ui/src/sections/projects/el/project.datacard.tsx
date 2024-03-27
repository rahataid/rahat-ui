import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
import { FC } from 'react';
import Activities from './projects.activity';

type ProjectDataCardProps = {
  beneficiaryDetails: any;
  projectVoucher: any;
};

const ProjectDataCard: FC<ProjectDataCardProps> = ({
  beneficiaryDetails,
  projectVoucher,
}) => {
  return (
    <>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <div className="grid grid-cols-2 col-span-2 gap-2">
          <DataCard
            className=""
            title="Enrolled Beneficiary"
            number={beneficiaryDetails?.enrolledBen || '-'}
            subTitle="Enrolled"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Referred Beneficiary"
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
