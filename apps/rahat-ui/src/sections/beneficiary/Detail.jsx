'use client'
import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import InfoCards from './infoCards';
import {useReadElProject} from '../../contract-hooks/generated'

export default function BeneficiaryDetailPageView() {

  const {data} = useReadElProject({
    address:'0x38BFDCCAc556ED026706EE21b4945cE86718D4D1',
    functionName:'defaultToken'
  })
  

  return (
    <>
      <div>
        <div className="flex justify-between gap-2">
          <div className="w-96">
            <InfoCards />
          </div>
          <div className="w-full flex-1 ">
            <BeneficiaryDetailTableView />
          </div>
        </div>
      </div>
    </>
  );
}
