import { BeneficiaryDetailView } from 'apps/rahat-ui/src/sections/beneficiary';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beneficiaries: Detail',
};

export default function BeneficiaryDetailPage() {
  return <BeneficiaryDetailView />;
}
