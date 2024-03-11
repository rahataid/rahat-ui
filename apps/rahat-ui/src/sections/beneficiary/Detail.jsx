'use client'
import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import InfoCards from './infoCards';
import { useGraphService } from '../../providers/subgraph-provider';
import {useEffect, useState } from 'react';
import { getBeneficiaryVoucher } from '../../hooks/el/subgraph/querycall';

export default function BeneficiaryDetailPageView() {

  const {queryService} = useGraphService();
  const [voucherData,setVoucherData]= useState();

  useEffect(()=>{
    const fetchBeneficiaryVoucherDetails =async ()=>{
      const beneficiaryData = await getBeneficiaryVoucher('0x082d43D30C31D054b1AEDbE08F50C2a1BBE76fC7',queryService);
      setVoucherData(beneficiaryData)

    }
    fetchBeneficiaryVoucherDetails()
  },[queryService])

  

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
