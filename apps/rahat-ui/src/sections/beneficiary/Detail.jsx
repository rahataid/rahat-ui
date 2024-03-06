import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import InfoCards from './infoCards';

export default function BeneficiaryDetailPageView() {
  

  console.log('status', status)
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
