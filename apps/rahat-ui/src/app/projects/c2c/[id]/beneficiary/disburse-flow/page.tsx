'use client';
import DisburseFlow from 'apps/rahat-ui/src/sections/projects/c2c/components/disburse-flow/disburse-flow';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DisburseFlowPage = () => {
  const searchParams = useSearchParams();
  const selectedBeneficiaries = searchParams.get('selectedBeneficiaries');
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);

  useEffect(() => {
    if (selectedBeneficiaries) {
      const beneficiariesArray = selectedBeneficiaries.split(',');
      setBeneficiaries(beneficiariesArray);
    }
  }, [selectedBeneficiaries]);

  if (!selectedBeneficiaries) return <div>Loading...</div>;

  return (
    <div className="bg-secondary h-[calc(100vh-60px)] overflow-auto">
      <DisburseFlow selectedBeneficiaries={beneficiaries} />
    </div>
  );
};

export default DisburseFlowPage;
