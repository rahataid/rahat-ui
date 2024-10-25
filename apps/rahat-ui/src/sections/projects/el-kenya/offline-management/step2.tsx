import { UUID } from 'crypto';
import { User } from 'lucide-react';
import { ConfirmModal } from './confirm-modal';
import { initialStepData } from './select.vendor.multi.step.form';

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
  let noOfBeneficiarySelected = stepData.disbursements.length;
  let data = stepData.disbursements;

  if (stepData.groups.length > 0) {
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
              <p className="text-base font-medium">2000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total no. of Vouchers assigned
              </p>
              <p className="text-base font-medium">{totalVouchersAssigned}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voucher Numbers</p>
              <p className="text-base font-medium">400</p>
            </div>
          </div>
          <div className="rounded-md p-4">
            <p className="text-base font-medium">Beneficiary List</p>
            <p className="text-sm text-muted-foreground">
              {noOfBeneficiarySelected} Beneficiaries Selected
            </p>
            <div className="flex flex-col">
              {data.map((beneficiary) => (
                <div className="flex space-x-2">
                  <div className="p-2 rounded-full bg-secondary">
                    <User size={18} strokeWidth={1.5} />
                  </div>
                  <p>{beneficiary.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
