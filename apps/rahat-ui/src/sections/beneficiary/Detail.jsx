'use client';
import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import InfoCards from './infoCards';
import { useGraphService } from '../../providers/subgraph-provider';
import { useCallback, useEffect, useState } from 'react';

export default function BeneficiaryDetailPageView() {
  const { queryService } = useGraphService();
  const [voucherData, setVoucherData] = useState();

  const fetchBeneficiaryVoucherDetails = useCallback(() => {
    const beneficiaryData = queryService.useBeneficiaryVoucher(
      '0x082d43D30C31D054b1AEDbE08F50C2a1BBE76fC7'
    );
    beneficiaryData.then((res) => {
      setVoucherData(res);
    });
  }, [queryService]);

  useEffect(() => {
    fetchBeneficiaryVoucherDetails();
  }, [fetchBeneficiaryVoucherDetails]);

  return (
    <>
      <InfoCards
        className="flex"
        card1="flex-1 shrink"
        card2="flex-1 shrink"
        card3="text-center"
        voucherData={voucherData}
      />
      <BeneficiaryDetailTableView tableHeight="h-[calc(100vh-465px)]" />
    </>
  );
}
