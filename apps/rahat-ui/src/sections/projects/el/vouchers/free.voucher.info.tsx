import React, { useEffect, useState } from 'react';
import { useProjectVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useParams } from 'next/navigation';

const FreeVoucherInfo = () => {

  const[contractAddress,setContractAddress] = useState<any>()

  const { id } = useParams();

  const projectSettings = localStorage.getItem('projectSettingsStore');

  useEffect(()=>{
    if(projectSettings){
      const settings = JSON.parse(projectSettings)?.state?.settings?.[id]
      setContractAddress({
        el:settings?.elproject?.address,
        eyeVoucher:settings?.eyevoucher?.address,
        referredVoucher:settings?.referralvoucher?.address
      })
    }

  },[projectSettings])
  
  const { data: transactionData, error } = useProjectVoucher(
    contractAddress?.el || '',
    'Free'
  );
  
  return (
    <div className="m-2 rounded bg-card p-4 shadow">
      <div className="flex items-center flex-wrap mt-2 gap-10 md:gap-32">
        <div>
          <p className="font-medium text-primary">Free</p>
          <p className="font-light">Voucher Name</p>
        </div>
        <div>
          <p className="font-medium text-primary">14</p>
          <p className="font-light">Price in USD/DR</p>
        </div>
        <div>
          <p className="font-medium text-primary">{transactionData?.freeVoucherBudget || 0}</p>
          <p className="font-light">No. of Voucher Minted</p>
        </div>
      </div>
      <div>
        <p className="mt-4 sm:mt-8 sm:w-2/3">
          Enter free voucher description here.
        </p>
      </div>
    </div>
  );
};

export default FreeVoucherInfo;
