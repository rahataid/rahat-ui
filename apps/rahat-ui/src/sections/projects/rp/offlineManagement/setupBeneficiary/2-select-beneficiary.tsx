type Step2SelectBeneficiaryProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Step2SelectBeneficiary({}: Step2SelectBeneficiaryProps) {
  return <div className="px-2 pb-4 mb-2">Select Beneficiaries</div>;
}
