import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Project } from '@rahataid/sdk/project/project.types';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { UserCheck, UserPlus, Users } from 'lucide-react';
import { FC } from 'react';

type ProjectInfoProps = {
  project: Project;
  totalVendor: any;
  loading: any;
  className?: any;
  beneficiaryDetails: any;
  refetchBeneficiary: VoidFunction;
  projectVoucher: any;
  voucherDetails: any;
};

const ProjectInfo: FC<ProjectInfoProps> = ({
  project,
  beneficiaryDetails,
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
          <p className="font-light text-xs text-muted-foreground">{key}</p>
          <p className="font-medium text-primary">{extras[key]}</p>
        </div>
      );
    });
  };
  return (
    <>
      <div className="grid grid-cols-5 grid-flow-col gap-2">
        <div className="col-span-2 rounded bg-card p-4 shadow flex flex-col justify-between">
          <div className="mt-6">
            <div>
              <p className="font-medium text-primary text-2xl">
                {project?.name}
              </p>            
            </div>
            <div className="flex items-center justify-between flex-wrap mt-4 gap-10 md:gap-32 mb-4">
              {renderExtras(project?.extras || {})}                
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
            <p className="mt-4 sm:w-2/3 italic">{project?.description}</p>
          </div>
        </div>
        <div className="col-span-3">
          <div className="grid md:grid-cols-3 gap-2">
            <DataCard
              className="h-full"
              title="Total Beneficiaries"
              Icon={Users}
              number={(Number(projectVoucher?.eyeVoucherAssigned)+Number(projectVoucher?.
                referredVoucherAssigned)
                ).toString() || 'N/A'}
              loading={loading}
            />
            <DataCard
              className=""
              title="Enrolled Beneficiaries"
              number={
                projectVoucher?.eyeVoucherAssigned.toLocaleString() || '-'
              }
              Icon={Users}
              refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Referred Beneficiaries"
              number={
                Number(projectVoucher?.
                  referredVoucherAssigned).toLocaleString()|| '-'
              }
              Icon={Users}
              refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Total Redemptions"
              number={totalVoucherRedeemed.toLocaleString() || 'N/A'}
              Icon={UserCheck}
              // refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Successful Enrollment"
              number={projectVoucher?.eyeVoucherClaimed?.toLocaleString() || '-'}
              Icon={UserCheck}
              // refresh={refetchBeneficiary}
            />
            <DataCard
              className=""
              title="Successful Referrals"
              number={projectVoucher?.referredVoucherClaimed?.toLocaleString() || '-'}
              Icon={UserPlus}
              // refresh={refetchBeneficiary}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
