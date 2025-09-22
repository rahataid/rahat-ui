import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Copy, Info } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { SearchInput, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';

type IProps = {
  beneficiaries: Array<any>;
  isLoading: boolean;
  handleDisbursement: (
    beneficiaries: `0x${string}`[],
    amount: string,
    details?: string,
  ) => void;
  isSubmitting: boolean;
};

interface FormData {
  selectedBeneficiary: string;
  amountPerBeneficiary: string;
  purpose: string;
}

export function BeneficiaryDisbursementForm({
  beneficiaries,
  isLoading,
  handleDisbursement,
  isSubmitting,
}: IProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      selectedBeneficiary: '',
      amountPerBeneficiary: '',
      purpose: '',
    },
  });

  const selectedBeneficiary = watch('selectedBeneficiary');
  const amountPerBeneficiary = watch('amountPerBeneficiary');

  const filteredBeneficiaries = beneficiaries?.filter(
    (beneficiary) =>
      beneficiary.piiData?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      beneficiary.walletAddress
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalAmount = 1 * (Number.parseFloat(amountPerBeneficiary) || 0); //for single selection

  const onSubmit = (data: FormData) => {
    console.log('FormData:', data);
    const { amountPerBeneficiary, purpose } = data;
    handleDisbursement(
      [selectedBeneficiary as `0x${string}`],
      amountPerBeneficiary,
      purpose,
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Select Beneficiary */}
      <div className="p-4 border rounded-sm space-y-4">
        <p className="font-semibold text-base">Select Beneficiary</p>
        {/* Search Input */}
        <SearchInput
          className="rounded-sm"
          name="beneficiary name"
          onSearch={(e) => setSearchTerm(e.target.value)}
        />

        {/* Beneficiary List */}
        <ScrollArea className="h-[350px]">
          {!isLoading ? (
            filteredBeneficiaries?.length ? (
              <RadioGroup
                value={selectedBeneficiary}
                onValueChange={(value) =>
                  setValue('selectedBeneficiary', value)
                }
                className="space-y-3"
              >
                {filteredBeneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className="flex items-center space-x-3 p-2 rounded-sm border"
                  >
                    <RadioGroupItem
                      value={beneficiary.walletAddress}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm/6">
                        {beneficiary.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">
                          {beneficiary.walletAddress}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            copyToClipboard(beneficiary.walletAddress)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="h-[370px] p-4 flex justify-center items-center text-gray-500">
                <div className="text-center">
                  <div className="flex justify-center">
                    <Info />
                  </div>
                  <p className="font-medium text-gray-800">No beneficiaries</p>
                  <p>
                    Beneficiaries will appear here once they're assigned to this
                    project
                  </p>
                </div>
              </div>
            )
          ) : (
            <SpinnerLoader />
          )}
        </ScrollArea>
      </div>

      {/* Right Side - Disbursement Details */}
      <div className="p-4 border rounded-sm">
        <p className="font-semibold text-base mb-4">Disbursement Details</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount per Beneficiary */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amount per Beneficiary
            </label>
            <Input
              placeholder="Enter amount"
              type="number"
              step="0.01"
              {...register('amountPerBeneficiary', {
                required: 'Amount is required',
                min: {
                  value: 0.01,
                  message: 'Amount must be greater than 0',
                },
              })}
            />
            {errors.amountPerBeneficiary && (
              <p className="text-sm text-destructive">
                {errors.amountPerBeneficiary.message}
              </p>
            )}
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Disbursement Details</label>
            <Textarea
              className="rounded"
              placeholder="Purpose of the disbursement"
              rows={4}
              {...register('purpose', {
                required: 'Purpose is required',
              })}
            />
            {errors.purpose && (
              <p className="text-sm text-destructive">
                {errors.purpose.message}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-3 pt-4">
            <div className="flex justify-between text-sm">
              <span>Total Beneficiaries:</span>
              {/* for single selection */}
              <span className="font-medium">1</span>{' '}
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount per Beneficiaries:</span>
              <span className="font-medium">
                ${amountPerBeneficiary || '0'}
              </span>
            </div>
            <hr />
            <div className="flex justify-between text-sm font-medium">
              <span>Total Amount</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={
              selectedBeneficiary.length === 0 ||
              !amountPerBeneficiary ||
              isSubmitting
            }
          >
            Initiate Transaction
          </Button>
        </form>
      </div>
    </div>
  );
}
