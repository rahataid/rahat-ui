import InfoCards from './infoCards';
import BeneficiaryDetailTableView from './beneficiaryDetailTable';

export default function BeneficiaryDetailPageView() {
  return (
    <>
      <InfoCards
        className="flex"
        card1="flex-1 shrink"
        card2="flex-1 shrink"
        card3="text-center"
      />
      <BeneficiaryDetailTableView tableHeight="h-[calc(100vh-465px)]" />
    </>
  );
}
