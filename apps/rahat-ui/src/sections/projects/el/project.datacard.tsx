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
  totalBeneficiary: any;
  totalVendor: any;
  loading: any;
  ELProjectStats: any;
  refetchBeneficiary: VoidFunction;
  refetchVoucher: VoidFunction;
};

const ProjectDataCard: FC<ProjectDataCardProps> = ({
  beneficiaryDetails,
  totalBeneficiary,
  loading,
  projectVoucher,
  voucherDetails,
  ELProjectStats,
  refetchBeneficiary,
  refetchVoucher,
}) => {
  const data = { ...projectVoucher, ...voucherDetails };

  const totalVoucherRedeemed =
    Number(data?.eyeVoucherBudget?.toString()) +
    Number(data?.referredVoucherBudget?.toString());

  const estimatedBudget =
    data?.eyeVoucherAssigned?.toString() * data?.freeVoucherPrice +
    data?.referredVoucherAssigned?.toString() * data?.referredVoucherPrice;

  const actualBudget =
    data?.eyeVoucherClaimed?.toString() * data?.freeVoucherPrice +
    data?.referredVoucherClaimed?.toString() * data?.referredVoucherPrice;

  const reconciliationRequested = ELProjectStats?.find(
    (entry) => entry.name === 'RECONCILIATION',
  )?.data.find((dataItem) => dataItem.id === 'REQUESTED')?.count;

  const reconciliationApproved = ELProjectStats?.find(
    (entry) => entry.name === 'RECONCILIATION',
  )?.data.find((dataItem) => dataItem.id === 'APPROVED')?.count;

  return (
    <>
      <div className="my-2 grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-2">
        <SmallDataCard
          title="Beneficiaries"
          number={totalBeneficiary}
          subTitle="Total Beneficiaries"
          loading={loading}
        />
        <SmallDataCard
          title="Voucher Redeemed"
          number={totalVoucherRedeemed}
          subTitle="Total Vouchers Claimed"
          loading={loading}
        />
        <SmallDataCard
          title="Estimated Budget"
          number={estimatedBudget}
          currency={data?.referredVoucherCurrency}
          subTitle="Vouchers Assigned"
          loading={loading}
        />
        <SmallDataCard
          title="Actual Budget"
          number={actualBudget}
          currency={data?.referredVoucherCurrency}
          subTitle="Vouchers Redeemed Value"
          loading={loading}
        />

        <SmallDataCard
          title="Reconcile Pending"
          number={reconciliationRequested}
          currency=""
          subTitle="Request from Vendors"
          loading={loading}
        />
        <SmallDataCard
          title="Reconcile Proceeded"
          number={reconciliationApproved}
          currency=""
          subTitle="Reconciliation Proceeded"
          loading={loading}
        />
      </div>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 col-span-2 gap-2">
          <DataCard
            className=""
            title="Enrolled Beneficiary"
            number={beneficiaryDetails ? beneficiaryDetails[0].toString() : '-'}
            subTitle="Enrolled"
            Icon={Users}
            refresh={refetchBeneficiary}
          />
          <DataCard
            className=""
            title="Referred Beneficiary"
            number={beneficiaryDetails ? beneficiaryDetails[1].toString() : '-'}
            subTitle="Referred"
            Icon={Users}
            refresh={refetchBeneficiary}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.eyeVoucherBudget?.toString() || '-'}
            subTitle="Free"
            Icon={Users}
            refresh={refetchVoucher}
          />
          <DataCard
            className=""
            title="Vouchers"
            number={projectVoucher?.referredVoucherBudget?.toString() || '-'}
            subTitle="Discount"
            Icon={Users}
            refresh={refetchVoucher}
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
