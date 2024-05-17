import { Metadata } from 'next';
import BeneficiaryView from '../../sections/beneficiary/beneficiary.view';

export const metadata: Metadata = {
  title: 'Beneficiaries',
  keywords: ['rahat-beneficiaries'],
  authors: [{ name: 'Rahat' }],
};

export default function BeneficiaryPage() {
  return <BeneficiaryView />;
}
