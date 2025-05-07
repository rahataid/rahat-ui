import { UUID } from 'crypto';
import { User } from 'lucide-react';
import { ConfirmModal } from './confirm-modal';
import { initialStepData } from './select.vendor.multi.step.form';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useReadRahatTokenTotalSupply,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';

interface ConfirmationProps {
  stepData: typeof initialStepData;
  beneficiariesDisbursements: [];
  isOpen: boolean;
}

export default function Confirmation({
  stepData,
  beneficiariesDisbursements,
  isOpen,
}: ConfirmationProps) {
  const { id } = useParams() as { id: UUID };

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data: tokenBalance } = useReadRahatTokenTotalSupply({
    address: contractSettings?.rahattoken?.address as `0x${string}`,
  });

  let noOfBeneficiarySelected = stepData.disbursements.length;
  let data = stepData.disbursements;

  const isGroupSelected = stepData.groups.length > 0;

  if (isGroupSelected) {
    data = beneficiariesDisbursements;
    stepData.groups.map((group) => {
      noOfBeneficiarySelected += group?.groupedBeneficiaries?.length;
    });
  }

  let totalVouchersAssigned = 0;
  data?.map((disbursment: any) => {
    totalVouchersAssigned +=
      Number(disbursment?.disbursementAmount) ||
      Number(disbursment?.amount) ||
      0;
  });

  return (
    <div className="flex flex-col justify-between">
      {
        <ConfirmModal
          isOpen={isOpen}
          vendorName={stepData.vendor.name}
          beneficiaries={noOfBeneficiarySelected}
          tokens={totalVouchersAssigned}
        />
      }
      <div className="p-4">
        <div className="rounded-md border p-4 grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-md p-4">
            <div>
              <p className="text-sm text-muted-foreground">Vendor Name</p>
              <p className="text-base font-medium">{stepData.vendor.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Beneficiaries Selected
              </p>
              <p className="text-base font-medium">{noOfBeneficiarySelected}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vendor Vouchers</p>
              <p className="text-base font-medium">
                {tokenBalance?.toString() ?? '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total no. of Vouchers assigned
              </p>
              <p className="text-base font-medium">{totalVouchersAssigned}</p>
            </div>
          </div>
          <div className="rounded-md p-4">
            <p className="text-base font-medium">Beneficiary List</p>
            {isGroupSelected ? (
              <p className="text-sm text-muted-foreground">
                {stepData?.groups?.length}{' '}
                {stepData?.groups?.length > 1 ? 'Groups' : 'Group'} Selected
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {noOfBeneficiarySelected}{' '}
                {noOfBeneficiarySelected > 1 ? 'Beneficiaries' : 'Beneficiary'}{' '}
                Selected
              </p>
            )}
            <div className="flex flex-col">
              <ScrollArea className="h-[calc(100vh-580px)]">
                {isGroupSelected
                  ? stepData?.groups?.map((group: any) => (
                      <div className="flex justify-between items-center space-x-4">
                        <div className="flex space-x-2 mt-2 items-center">
                          <div className="p-2 rounded-full bg-secondary">
                            <User size={18} strokeWidth={1.5} />
                          </div>
                          <p>{group?.name}</p>
                        </div>
                        <p>
                          {group?.groupedBeneficiaries?.length}{' '}
                          {group?.groupedBeneficiaries?.length > 1
                            ? 'beneficiaries'
                            : 'beneficiary'}
                        </p>
                      </div>
                    ))
                  : data.map((beneficiary) => (
                      <div className="flex space-x-2 mt-2 items-center">
                        <div className="p-2 rounded-full bg-secondary">
                          <User size={18} strokeWidth={1.5} />
                        </div>
                        <p>{beneficiary?.phone}</p>
                      </div>
                    ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
