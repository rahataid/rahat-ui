'use client';
import { useCallback, useEffect, useState } from 'react';
import { useGraphService } from '../../providers/subgraph-provider';
import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import InfoCards from './infoCards';
import { useBeneficaryVoucher } from '../../hooks/el/subgraph/querycall';

export default function BeneficiaryDetailPageView() {
  const { data: voucherData, error: voucherError } = useBeneficaryVoucher(
    '0x082d43D30C31D054b1AEDbE08F50C2a1BBE76fC7',
  );

  return (
    <>
      <div>
        <div className="flex justify-between gap-2">
          <div className="w-96">
            <InfoCards voucherData={voucherData} voucherError={voucherError} />
          </div>
          <div className="w-full flex-1 ">
            <BeneficiaryDetailTableView />
          </div>
        </div>
      </div>
    </>
  );
}
