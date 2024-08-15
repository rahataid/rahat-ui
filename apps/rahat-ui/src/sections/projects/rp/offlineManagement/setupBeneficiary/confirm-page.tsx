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
} from '@rahat-ui/query';

type ConfirmPageProps = {
  form: UseFormReturn<z.infer<any>>;
  vendor: any;
  disbursmentList: any;
};

const ComfirmPage = ({ form, vendor }: ConfirmPageProps) => {
  const router = useRouter();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const syncBen = useSyncOfflineBeneficiaries(id as UUID);
  const selectedVendor = vendor.find(
    (v) => v?.id == form.getValues('vendorId'),
  );
  const selectedBeneficiries = form.getValues('disbursements');
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const noOfSelectedBeneficiries = form.getValues('disbursements')?.length || 0;
  return (
    <div className="bg-card rounded-lg m-6 p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => router.back()}
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
                  {noOfSelectedBeneficiries}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Vendor Tokens
                </h2>
                <p className="text-2xl font-semibold text-gray-800">2000</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Total no. of tokens assigned
                </h2>
                <p className="text-2xl font-semibold text-gray-800">100</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Token Amount
                </h2>
                <p className="text-2xl font-semibold text-gray-800">400</p>
              </div>
            </div>
          </div>

          {/* Right Section: Beneficiary List */}
          <div className="flex-1 p-6 bg-card rounded-lg border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-4">
              Beneficiary List
            </h2>
            <p className="text-sm font-medium text-gray-800 mb-4">
              {noOfSelectedBeneficiries} beneficiaries selected
            </p>
            <ScrollArea className="h-[calc(100vh-620px)]">
              <ul className="space-y-2">
                {Array(noOfSelectedBeneficiries)
                  .fill(0)
                  .map((_, index) => (
                    <li
                      key={index}
                      className="flex items-center p-2 bg-gray-100 rounded-lg"
                    >
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-500">👤</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          Aadarsha Lamichhane
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
        <Button className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4 w-36">
          Cancel
        </Button>
        <Button
          onClick={() => {
            syncBen.mutateAsync({
              vendorId: selectedVendor?.id,
              disbursements: selectedBeneficiries,
              tokenAddress: contractSettings?.tokenAddress || '',
            });
            setIsOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-36"
        >
          Finish
        </Button>
        <ConfirmModal isOpen={isOpen} />
      </div>
    </div>
  );
};

export default ComfirmPage;
