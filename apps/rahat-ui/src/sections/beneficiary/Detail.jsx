import InfoCards from './infoCards';
import BeneficiaryDetailTableView from './beneficiaryDetailTable';

export default function BeneficiaryDetailPageView() {
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
