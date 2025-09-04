import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Copy, Info } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { SearchInput } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

interface Beneficiary {
  id: string;
  name: string;
  address: string;
}

interface FormData {
  selectedBeneficiaries: string[];
  amountPerBeneficiary: string;
  purpose: string;
}

const mockBeneficiaries: Beneficiary[] = [
  { id: '1', name: 'Aadarsha Lamichhane', address: '0x3ad4...f54' },
  { id: '2', name: 'Aadarsha Lamichhane', address: '0x3ad4...f54' },
  { id: '3', name: 'Aadarsha Lamichhane', address: '0x3ad4...f54' },
  { id: '4', name: 'Aadarsha Lamichhane', address: '0x3ad4...f54' },
  { id: '5', name: 'Aadarsha Lamichhane', address: '0x3ad4...f54' },
  { id: '6', name: 'Aadarsha Lamichhane', address: '0x3ad4...f54' },
];

export function BeneficiaryDisbursementForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      selectedBeneficiaries: [],
      amountPerBeneficiary: '',
      purpose: '',
    },
  });

  const amountPerBeneficiary = watch('amountPerBeneficiary');

  const filteredBeneficiaries = mockBeneficiaries.filter(
    (beneficiary) =>
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBeneficiaryToggle = (beneficiaryId: string) => {
    setSelectedBeneficiaries((prev) =>
      prev.includes(beneficiaryId)
        ? prev.filter((id) => id !== beneficiaryId)
        : [...prev, beneficiaryId],
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalAmount =
    selectedBeneficiaries.length *
    (Number.parseFloat(amountPerBeneficiary) || 0);

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', {
      ...data,
      selectedBeneficiaries,
      totalAmount,
    });
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
          {filteredBeneficiaries?.length ? (
            <div className="space-y-3">
              {filteredBeneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="flex items-center space-x-3 p-2 rounded-sm border"
                >
                  <Checkbox
                    id={beneficiary.id}
                    checked={selectedBeneficiaries.includes(beneficiary.id)}
                    onCheckedChange={() =>
                      handleBeneficiaryToggle(beneficiary.id)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm/6">
                      {beneficiary.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{beneficiary.address}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => copyToClipboard(beneficiary.address)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <span className="font-medium">
                {selectedBeneficiaries.length}
              </span>
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
            className="w-full bg-slate-400 hover:bg-slate-500 text-white"
            disabled={
              selectedBeneficiaries.length === 0 || !amountPerBeneficiary
            }
          >
            Initiate Transaction
          </Button>
        </form>
      </div>
    </div>
  );
}
