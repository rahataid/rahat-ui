'use client';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users ,DollarSign} from 'lucide-react';
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
              number={totalVendor?.toLocaleString() || 'N/A'}
              loading={loading}
              Icon={Users}
            />
            <DataCard
              title="Claims Pending"
              number={reconciliationRequested?.toLocaleString() || 'N/A'}
              loading={loading}
            />
            <DataCard
              title="Claims Approved"
              number={reconciliationApproved?.toLocaleString() || 'N/A'}
              loading={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <DataCard
              title="Estimated Budget"
              number={estimatedBudget?.toLocaleString() || 'N/A'}
              subtitle="Vouchers Assigned (Rp)"
              currency={data?.referredVoucherCurrency}
              Icon={DollarSign}
              loading={loading}
            />
            <DataCard
              className=""
              title="Actual Budget"
              number={actualBudget?.toLocaleString() || 'N/A'}
              subtitle="Vouchers Redeemed Value (Rp)"
              Icon={DollarSign}
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
