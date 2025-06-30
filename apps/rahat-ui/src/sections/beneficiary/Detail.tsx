'use client';
import { useBeneficaryVoucher } from '../../hooks/el/subgraph/querycall';
// import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import InfoCards from './infoCards';

export default function BeneficiaryDetailPageView() {
  const { data: voucherData, error: voucherError } = useBeneficaryVoucher(
    '0x082d43D30C31D054b1AEDbE08F50C2a1BBE76fC7',
  );

  console.log('sad');
  return (
    <>
      <InfoCards voucherData={voucherData} voucherError={voucherError} />
      {/* <BeneficiaryDetailTableView
        tableSpacing="p-2"
        tableScrollAreaHeight="h-[calc(100vh-303px)]"
      /> */}
    </>
  );
}
