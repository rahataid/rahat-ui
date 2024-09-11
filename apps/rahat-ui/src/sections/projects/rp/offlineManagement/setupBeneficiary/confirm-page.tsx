'use client';
import { z } from 'zod';
import { UUID } from 'crypto';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { ConfirmModal } from './confirm-modal';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useSyncOfflineBeneficiaries,
  useGetBeneficiariesDisbursements,
} from '@rahat-ui/query';
import { useRSQuery } from '@rumsan/react-query';

type ConfirmPageProps = {
  form: UseFormReturn<z.infer<any>>;
  vendor: any;
  disbursmentList: any;
  setCurrentStep: (currentStep: number) => void;

  currentStep: number;
};

const ComfirmPage = ({
  form,
  vendor,
  disbursmentList,
  setCurrentStep,
  currentStep,
}: ConfirmPageProps) => {
  const router = useRouter();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const syncBen = useSyncOfflineBeneficiaries(id as UUID);
  const { queryClient, rumsanService } = useRSQuery();

  const selectedVendor = vendor.find(
    (v) => v?.id == form.getValues('vendorId'),
  );
  const groupIds = form.getValues('groupIds') || [];

  const { data: beneficiariesDisbursements } = useGetBeneficiariesDisbursements(
    id as UUID,
    groupIds,
  );
  const disBursementIds = beneficiariesDisbursements?.map(
    (disBursement) => disBursement.id,
  );
  let selectedDisbursementId = form.getValues('disbursements');
  let selectedDisbursement;
  if (selectedDisbursementId.length === 0) {
    selectedDisbursementId = disBursementIds;
    selectedDisbursement = beneficiariesDisbursements;
  } else {
    selectedDisbursement = disbursmentList?.filter((disbursment: any) =>
      selectedDisbursementId?.includes(disbursment?.disbursmentId),
    );
  }

  let tokenAmount = 0;
  selectedDisbursement?.map((disbursment: any) => {
    tokenAmount += Number(disbursment?.amount);
  });
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const noOfSelectedDisbursement =
    form.getValues('disbursements')?.length ||
    beneficiariesDisbursements?.length;
  return (
    <div className="bg-card rounded-lg m-6 p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => {
              setCurrentStep(currentStep - 1);
            }}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-gray-900">Confirmation</h1>
        </div>
        <p className="text-gray-500 font-normal text-base">
          You can confirm your selection here
        </p>
      </div>
      <div className="mt-8 mb-8">
        <div className="flex p-4 bg-card rounded-lg space-x-6">
          <div className="flex-1 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-10">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Vendor Name
                </h2>
                <p className="text-xl font-semibold text-gray-800">
                  {selectedVendor?.name}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Beneficiaries Selected:
                </h2>
                <p className="text-2xl font-semibold text-gray-800">
                  {noOfSelectedDisbursement}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Total no. of tokens assigned
                </h2>
                <p className="text-2xl font-semibold text-gray-800">
                  {tokenAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Beneficiary List */}
          <div className="flex-1 p-6 bg-card rounded-lg border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-4">
              Beneficiary List
            </h2>
            <p className="text-sm font-medium text-gray-800 mb-4">
              {noOfSelectedDisbursement} beneficiaries selected
            </p>
            <ScrollArea className="h-[calc(100vh-620px)]">
              <ul className="space-y-2">
                {selectedDisbursement?.map((disbursement, index) => (
                  <li
                    key={index}
                    className="flex items-center p-2 bg-gray-100 rounded-lg"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">👤</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">
                        {disbursement?.name || 'unknow'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button
          className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4 w-36"
          onClick={() => router.push(`/projects/rp/${id}/offlineManagement`)}
        >
          Cancel
        </Button>
        <Button
          disabled={noOfSelectedDisbursement === 0}
          onClick={() => {
            syncBen.mutateAsync({
              vendorId: selectedVendor?.id,
              disbursements: selectedDisbursementId,
              tokenAddress: contractSettings?.rahattoken?.address || '',
              groupIds,
            });
            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: ['rpGetOfflineVendors'],
              });
            }, 10000);

            setIsOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-36"
        >
          Finish
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          disbursements={noOfSelectedDisbursement}
          tokens={tokenAmount}
          vendorName={selectedVendor?.name}
        />
      </div>
    </div>
  );
};

export default ComfirmPage;
