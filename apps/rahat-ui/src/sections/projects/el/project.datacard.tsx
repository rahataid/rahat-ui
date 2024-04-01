import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
import { FC } from 'react';
import Activities from './projects.activity';

type ProjectDataCardProps = {
  beneficiaryDetails: any;
  projectVoucher: any;
  voucherDetails:any;
};

const ProjectDataCard: FC<ProjectDataCardProps> = ({
  beneficiaryDetails,
  projectVoucher,
  voucherDetails,
}) => {
  const data ={...projectVoucher,...voucherDetails}
  return (
    <>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <div className="grid grid-cols-2 col-span-2 gap-2">
          <DataCard
            className=""
            title="Enrolled Beneficiary"
            number={beneficiaryDetails?beneficiaryDetails[0].toString() : '-'}
            subTitle="Enrolled"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Referred Beneficiary"
            number={beneficiaryDetails? beneficiaryDetails[1].toString() :'-'}
            subTitle="Referred"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.eyeVoucherBudget?.toString() || '-'}
            subTitle="Free"
            Icon={Users}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.referredVoucherBudget?.toString() || '-'}
            subTitle="Discount"
            Icon={Users}
          />
        </div>
        <div>
          <Activities title="Vouchers" data={data} />
        </div>
      </div>
    </>
  );
};

export default ProjectDataCard;
