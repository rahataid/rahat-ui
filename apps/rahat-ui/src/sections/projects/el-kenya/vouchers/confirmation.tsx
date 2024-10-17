import { useParams, useSearchParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import { UUID } from 'crypto';
import { User } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

interface ConfirmSelectionProps {
  stepData: any;
  handleBack: any;
  handleNext: any;
  beneficiaryGroupSelected: boolean;
}

const BeneficiaryInfo = ({ selectedBeneficiaries }) => (
  <div className="bg-secondary rounded-md p-4">
    <InfoRow label="Beneficiary Selected" value={selectedBeneficiaries} />
    <InfoRow label="Project Voucher Balance" value={500} />
    <InfoRow label="Distribute Vouchers to Beneficiaries" value={1} />
    <InfoRow
      label="Total Vouchers to Distribute"
      value={selectedBeneficiaries * 1}
    />
  </div>
);

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);

const BeneficiaryList = ({ data, beneficiaryGroupSelected }) => (
  <div className="rounded-md p-4">
    <p className="text-base font-medium">
      {beneficiaryGroupSelected ? 'Beneficiary Group' : 'Beneficiary'} List
    </p>
    <p className="text-sm text-muted-foreground">
      {beneficiaryGroupSelected
        ? `${data.length} Beneficiaries Groups`
        : `${data.length} Selected`}
    </p>
    <div className="flex flex-col gap-4">
      {data.map((ben) => (
        <BeneficiaryItem
          key={ben.walletAddress}
          ben={ben}
          beneficiaryGroupSelected={beneficiaryGroupSelected}
        />
      ))}
    </div>
  </div>
);

const BeneficiaryItem = ({ ben, beneficiaryGroupSelected }) => (
  <div className="flex justify-between">
    <div className="flex space-x-2">
      <div className="p-2 rounded-full bg-secondary">
        <User size={18} strokeWidth={1.5} />
      </div>
      <p>{ben.name}</p>
    </div>
    {beneficiaryGroupSelected && (
      <p>{ben._count.groupedBeneficiaries} beneficiaries</p>
    )}
  </div>
);

export default function ConfirmSelection({
  handleBack,
  stepData,
  handleNext,
  beneficiaryGroupSelected,
}: ConfirmSelectionProps) {
  const { id } = useParams() as { id: UUID };
  const searchParam = useSearchParams();
  const benef = searchParam.get('benef');

  const selectedBeneficiaries = beneficiaryGroupSelected
    ? stepData.selectedGroups.reduce(
        (acc, group) => acc + group._count.groupedBeneficiaries,
        0,
      )
    : stepData.selectedBeneficiaries.length;

  const data = beneficiaryGroupSelected
    ? stepData.selectedGroups
    : stepData.selectedBeneficiaries;

  return (
    <div className="flex flex-col justify-between">
      <div className="p-4">
        <HeaderWithBack
          title="Confirmation"
          subtitle="Confirm your selection before you proceed"
          path={`/projects/el-kenya/${id}/vouchers`}
        />
        <div className="rounded-md border p-4 grid grid-cols-2 gap-4">
          <BeneficiaryInfo selectedBeneficiaries={selectedBeneficiaries} />
          <BeneficiaryList
            data={data}
            beneficiaryGroupSelected={beneficiaryGroupSelected}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 p-4">
        <Button onClick={handleBack} variant="secondary">
          Close
        </Button>
        <Button onClick={handleNext}>Finish</Button>
      </div>
    </div>
  );
}
