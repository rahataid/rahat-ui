'use client';
import { useCallback, useEffect, useState } from 'react';
import { useGraphService } from '../../providers/subgraph-provider';
import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import InfoCards from './infoCards';

export default function BeneficiaryDetailPageView() {
  const { queryService } = useGraphService();
  const [voucherData, setVoucherData] = useState();

  const fetchBeneficiaryVoucherDetails = useCallback(() => {
    const beneficiaryData = queryService.useBeneficiaryVoucher(
      '0x082d43D30C31D054b1AEDbE08F50C2a1BBE76fC7',
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
      <div>
        <div className="flex justify-between gap-2">
          <div className="w-96">
            <InfoCards voucherData={voucherData} />
          </div>
          <div className="w-full flex-1 ">
            <BeneficiaryDetailTableView />
          </div>
        </div>
      </div>
    </>
  );
}
