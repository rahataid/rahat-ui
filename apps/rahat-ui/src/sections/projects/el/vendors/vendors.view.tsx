'use client';

import DataCard from '../../../../components/dataCard';
import VendorTable from '../../../../sections/vendors/vendorsTable';

export default function VendorsPage() {
  return (
    <div className="bg-secondary">
      {/* Data Cards */}
      <div className="grid md:grid-cols-4 gap-2 mx-2">
        <DataCard
          className="mt-2"
          title="Free Voucher Assigned"
          number={'12'}
          subTitle="To Enrolled Beneficiary"
        />
        <DataCard
          className="mt-2"
          title="Free Vouchers Redeemed"
          number={'12'}
          subTitle="By Enrolled Beneficiary"
        />
        <DataCard
          className="mt-2"
          title="Discount Vouchers Referred"
          number={'12'}
          subTitle="To Referred Beneficiaries"
        />
        <DataCard
          className="mt-2"
          title="Discount Voucher Redeemed"
          number={'12'}
          subTitle="Referred Beneficiaries"
        />
      </div>
      <VendorTable />
    </div>
  );
}
