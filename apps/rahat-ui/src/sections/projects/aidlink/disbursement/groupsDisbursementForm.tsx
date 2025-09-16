import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Users, Calendar, Info } from 'lucide-react';
import { SearchInput, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { UUID } from 'crypto';

type IProps = {
  groups: Array<any>;
  isLoading: boolean;
  handleDisbursement: (
    beneficiaryGroups: UUID,
    amount: string,
    details?: string,
  ) => void;
};

interface FormData {
  selectedGroup: string;
  amountPerBeneficiary: string;
  disbursementPurpose: string;
}

export function BeneficiaryGroupsDisbursementForm({
  groups,
  isLoading,
  handleDisbursement,
}: IProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { register, watch, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      selectedGroup: '',
      amountPerBeneficiary: '',
      disbursementPurpose: '',
    },
  });

  const selectedGroup = watch('selectedGroup');
  const amountPerBeneficiary = watch('amountPerBeneficiary');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedGroupData = groups.find(
    (group) => group.uuid === selectedGroup,
  );
  const totalBeneficiaries =
    selectedGroupData?._count?.groupedBeneficiaries || 0;
  const amountPerBeneficiaryNum = Number.parseFloat(amountPerBeneficiary) || 0;
  const totalAmount = totalBeneficiaries * amountPerBeneficiaryNum;

  const onSubmit = (data: FormData) => {
    const { amountPerBeneficiary, disbursementPurpose } = data;
    console.log('FormData:', data);
    handleDisbursement(
      selectedGroup as UUID,
      amountPerBeneficiary,
      disbursementPurpose,
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Select Beneficiary Groups */}
      <div className="p-4 border rounded-sm space-y-4">
        <p className="font-semibold text-base">Select Beneficiary Groups</p>
        {/* Search Input */}
        <SearchInput
          className="rounded-sm"
          name="groups"
          onSearch={(e) => setSearchTerm(e.target.value)}
        />

        {/* Radio Group */}
        <ScrollArea className="h-[370px]">
          {!isLoading ? (
            filteredGroups?.length ? (
              <RadioGroup
                value={selectedGroup}
                onValueChange={(value) => setValue('selectedGroup', value)}
                className="space-y-3"
              >
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-start space-x-3 p-3 rounded-sm border hover:bg-gray-50"
                  >
                    <RadioGroupItem value={group.uuid} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {group.name}
                      </div>
                      {/* <div className="text-sm text-gray-600 mt-1">
                      {group.description}
                    </div> */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {group._count.groupedBeneficiaries} beneficiaries
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated: {dateFormat(group.updatedAt)}</span>
                        </div>
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
                  <p className="font-medium text-gray-800">
                    No beneficiary groups
                  </p>
                  <p>
                    Beneficiary groups will appear here once they're assigned to
                    this project
                  </p>
                </div>
              </div>
            )
          ) : (
            <SpinnerLoader />
          )}
        </ScrollArea>
      </div>

      {/* Right Column - Disbursement Details */}
      <div className="p-4 border rounded-sm">
        <p className="font-semibold text-base mb-4">Disbursement Details</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount per Beneficiary */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount per Beneficiary</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              step="0.01"
              {...register('amountPerBeneficiary')}
            />
          </div>

          {/* Disbursement Details */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Disbursement Details</Label>
            <Textarea
              className="rounded"
              id="purpose"
              placeholder="Purpose of the disbursement"
              rows={3}
              {...register('disbursementPurpose')}
            />
          </div>

          {/* Summary */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Selected groups:</span>
              <span className="font-medium">{selectedGroup ? 1 : 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Beneficiaries:</span>
              <span className="font-medium">
                {totalBeneficiaries.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount per Beneficiaries:</span>
              <span className="font-medium">
                ${amountPerBeneficiaryNum.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total Amount</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!selectedGroup || !amountPerBeneficiary}
          >
            Initiate Transaction
          </Button>
        </form>
      </div>
    </div>
  );
}
