import { useParams, useSearchParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import { UUID } from 'crypto';
import { User } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';

interface ConfirmSelectionProps {
  stepData: any;
  handleBack: any;
  handleNext: any;
  beneficiaryGroupSelected: boolean;
}

const BeneficiaryInfo = ({
  selectedBeneficiaries,
  tokenBalance,
}: {
  selectedBeneficiaries: any;
  tokenBalance: string;
}) => (
  <div className="bg-secondary rounded-md p-4">
    <InfoRow label="Beneficiary Selected" value={selectedBeneficiaries} />
    <InfoRow label="Project Voucher Balance" value={tokenBalance} />
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
  <div className="rounded-md px-4">
    <p className="text-base font-medium">
      {beneficiaryGroupSelected ? 'Beneficiary Group' : 'Beneficiary'} List
    </p>
    <p className="text-sm text-muted-foreground mb-4">
      {beneficiaryGroupSelected
        ? `${data.length} Beneficiaries Groups`
        : `${data.length} Selected`}
    </p>
    <ScrollArea className="h-[calc(100vh-460px)]">
      <div className="flex flex-col gap-2">
        {data.map((ben) => (
          <BeneficiaryItem
            key={ben.walletAddress}
            ben={ben}
            beneficiaryGroupSelected={beneficiaryGroupSelected}
          />
        ))}
      </div>
    </ScrollArea>
  </div>
);

const BeneficiaryItem = ({ ben, beneficiaryGroupSelected }) => (
  <div className="flex justify-between">
    <div className="flex items-center space-x-2">
      <div className="p-2 rounded-full bg-secondary">
        <User size={18} strokeWidth={1.5} />
      </div>
      <p>{beneficiaryGroupSelected ? ben?.name : ben?.phone}</p>
    </div>
    {beneficiaryGroupSelected && (
      <p>{ben?.groupedBeneficiaries?.length} beneficiaries</p>
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
        (acc, group) => acc + group?.groupedBeneficiaries?.length,
        0,
      )
    : stepData.selectedBeneficiaries.length;

  const data = beneficiaryGroupSelected
    ? stepData.selectedGroups
    : stepData.selectedBeneficiaries;

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data: tokenBalance } = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken?.address,
    args: [contractSettings?.rahatcvakenya?.address],
  });
  return (
    <>
      <div className="h-[calc(100vh-58px)] flex flex-col justify-between">
        <div className="p-4">
          <HeaderWithBack
            title="Confirmation"
            subtitle="Confirm your selection before you proceed"
            path={`/projects/el-kenya/${id}/vouchers`}
          />
          <div className="rounded-md border p-4 grid grid-cols-2 gap-4">
            <BeneficiaryInfo
              selectedBeneficiaries={selectedBeneficiaries}
              tokenBalance={tokenBalance?.toString() ?? '-'}
            />
            <BeneficiaryList
              data={data}
              beneficiaryGroupSelected={beneficiaryGroupSelected}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 p-4">
          <Button onClick={handleBack} variant="secondary" className="px-12">
            Close
          </Button>
          <Button
            disabled={!tokenBalance || Number(tokenBalance) === 0}
            className="px-12"
            onClick={handleNext}
          >
            Finish
          </Button>
        </div>
      </div>
    </>
  );
}
