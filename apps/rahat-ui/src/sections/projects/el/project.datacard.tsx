'use client';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
import { FC } from 'react';
import Activities from './projects.activity';

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
  loading,
  projectVoucher,
  voucherDetails,
  ELProjectStats,
  totalVendor,
  refetchBeneficiary,
}) => {
  const data = { ...projectVoucher, ...voucherDetails };

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
      <div className="grid grid-cols-5 gap-2 mt-2">
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-2">
            <DataCard
              title="Total Vendors"
              number={totalVendor || 'N/A'}
              loading={loading}
            />
            <DataCard
              title="Claim Pending"
              number={reconciliationRequested || 'N/A'}
              loading={loading}
            />
            <DataCard
              title="Claim Approved"
              number={reconciliationApproved || 'N/A'}
              loading={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <DataCard
              title="Estimated Budget"
              number={estimatedBudget || 'N/A'}
              subtitle="Vouchers Assigned (Rp)"
              currency={data?.referredVoucherCurrency}
              loading={loading}
            />
            <DataCard
              className=""
              title="Redeemption Value"
              number={actualBudget || 'N/A'}
              subtitle="Vouchers Redeemed Value (Rp)"
              Icon={Users}
              refresh={refetchBeneficiary}
            />
          </div>
        </div>
        <div className="col-span-2">
          <Activities title="Vouchers" data={data} />
        </div>
      </div>
    </>
  );
};

export default ProjectDataCard;
