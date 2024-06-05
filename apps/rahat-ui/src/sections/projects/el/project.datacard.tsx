'use client';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
import { FC } from 'react';
import Activities from './projects.activity';
import SmallDataCard from './project.datacard.small';

type ProjectDataCardProps = {
  beneficiaryDetails: any;
  projectVoucher: any;
  voucherDetails: any;
  totalVendor: any;
  loading: any;
  ELProjectStats: any;
  refetchBeneficiary: VoidFunction;
  refetchVoucher: VoidFunction;
};

const ProjectDataCard: FC<ProjectDataCardProps> = ({
  beneficiaryDetails,
  loading,
  projectVoucher,
  voucherDetails,
  ELProjectStats,
  totalVendor,
  refetchBeneficiary,
  refetchVoucher,
}) => {
  const data = { ...projectVoucher, ...voucherDetails };

  const totalVoucherRedeemed =
    Number(data?.freeVoucherClaimed?.toString()) +
    Number(data?.referredVoucherClaimed?.toString());

  const estimatedBudget =
    data?.eyeVoucherAssigned?.toString() * data?.freeVoucherPrice +
    data?.referredVoucherAssigned?.toString() * data?.referredVoucherPrice;

  const actualBudget =
    data?.eyeVoucherClaimed?.toString() * data?.freeVoucherPrice +
    data?.referredVoucherClaimed?.toString() * data?.referredVoucherPrice;

  const reconciliationRequested = ELProjectStats?.find(
    (entry: { name: string }) => entry.name === 'RECONCILIATION',
  )?.data.find(
    (dataItem: { id: string }) => dataItem.id === 'REQUESTED',
  )?.count;

  const reconciliationApproved = ELProjectStats?.find(
    (entry: { name: string }) => entry.name === 'RECONCILIATION',
  )?.data.find((dataItem: { id: string }) => dataItem.id === 'APPROVED')?.count;

  return (
    <>
      <div className="grid grid-cols-5 gap-4 mt-1">
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-4">
            <SmallDataCard
              title="Vendors"
              number={totalVendor}
              currency={data?.referredVoucherCurrency}
              loading={loading}
            />
            <SmallDataCard
              title="Reconcile Pending"
              number={reconciliationRequested}
              currency=""
              loading={loading}
            />
            <SmallDataCard
              title="Reconcile Proceeded"
              number={reconciliationApproved}
              currency=""
              loading={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <DataCard
              title="Estimated Budget"
              number={estimatedBudget}
              currency={data?.referredVoucherCurrency}
              loading={loading}
            />
            <DataCard
              className=""
              title="Actual Budget"
              number={'tbd'}
              Icon={Users}
              refresh={refetchBeneficiary}
            />
          </div>
        </div>
        <div className="col-span-2 rounded bg-card p-4 shadow">
          <Activities title="Vouchers" data={data} />
        </div>
      </div>
    </>
  );
};

export default ProjectDataCard;
