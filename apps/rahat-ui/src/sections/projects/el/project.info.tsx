import { Project } from '@rahataid/sdk/project/project.types';
import { FC } from 'react';
import SmallDataCard from './project.datacard.small';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';

type ProjectInfoProps = {
  project: Project;
  totalVendor: any;
  loading: any;
  className?: any;
  beneficiaryDetails: any;
  totalBeneficiary: any;
  refetchBeneficiary: VoidFunction;
  projectVoucher: any;
  voucherDetails: any;
};

const ProjectInfo: FC<ProjectInfoProps> = ({
  project,
  beneficiaryDetails,
  totalBeneficiary,
  refetchBeneficiary,
  loading,
  projectVoucher,
  voucherDetails,
}) => {
  const data = { ...projectVoucher, ...voucherDetails };
  const totalVoucherRedeemed =
    Number(data?.freeVoucherClaimed?.toString()) +
    Number(data?.referredVoucherClaimed?.toString());

  const renderExtras = (extras: JSON | string | Record<string, string>) => {
    if (typeof extras === 'string') {
      return <p className="font-light">{extras}</p>;
    }
    return Object.keys(extras).map((key) => {
      return (
        <div key={key}>
          <p className="font-medium text-primary">{extras[key]}</p>
          <p className="font-light">{key}</p>
        </div>
      );
    });
  };
  return (
    <>
      <div className="grid grid-cols-5 grid-flow-col gap-2">
        <div className="col-span-2 rounded bg-card p-4 shadow">
          <div className="mt-6">
            <div>
              <p className="font-medium text-primary text-2xl">
                {project?.name}
              </p>
            </div>
            <div className="flex items-center justify-between flex-wrap mt-4 gap-10 md:gap-32 mb-4">
              {renderExtras(project?.extras || {})}
              <div>
                <p className="font-light text-xs text-muted-foreground">
                  Status
                </p>
                <p className="font-medium text-primary">{project?.status}</p>
              </div>
              <div>
                <p className="font-light text-xs text-muted-foreground">Type</p>
                <p className="font-medium text-primary">{project?.type}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="font-light text-xs text-muted-foreground">Status</p>
            {project?.status === 'NOT_READY' ? (
              <Badge className="bg-red-200 text-red-600">Not Ready</Badge>
            ) : project?.status === 'ACTIVE' ? (
              <Badge className="bg-green-200 text-green-600">Active</Badge>
            ) : (
              <Badge className="bg-amber-200 text-amber-600">Closed</Badge>
            )}
            {/* <p className="font-medium text-primary">{project?.status}</p> */}
          </div>
          <div>
            <p className="mt-4 sm:w-2/3">{project?.description}</p>
          </div>
        </div>
        <div className="col-span-3">
          <div className="grid md:grid-cols-3 gap-2">
            <DataCard
              className="h-full"
              title="Total Beneficiary"
              number={totalBeneficiary}
              loading={loading}
            />
            <DataCard
              className=""
              title="Enrolled Beneficiary"
              number={
                beneficiaryDetails ? beneficiaryDetails[0].toString() : '-'
              }
              Icon={Users}
              refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Referred Beneficiary"
              number={
                beneficiaryDetails ? beneficiaryDetails[1].toString() : '-'
              }
              Icon={Users}
              refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Vouchers Redeemed"
              number={totalVoucherRedeemed}
              Icon={Users}
              refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Free Vouchers"
              number={projectVoucher?.eyeVoucherBudget?.toString() || '-'}
              Icon={Users}
              refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Discount Vouchers"
              number={projectVoucher?.referredVoucherBudget?.toString() || '-'}
              Icon={Users}
              refresh={refetchBeneficiary}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
