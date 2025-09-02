'use client';

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
import { SearchInput } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

interface BeneficiaryGroup {
  id: string;
  name: string;
  description: string;
  beneficiaries: number;
  lastUpdated: string;
}

interface FormData {
  selectedGroup: string;
  amountPerBeneficiary: string;
  disbursementPurpose: string;
}

const beneficiaryGroups: BeneficiaryGroup[] = [
  {
    id: 'flood-relief-1',
    name: 'Emergency Flood Relief',
    description: 'Flood affected families in northern region',
    beneficiaries: 1200,
    lastUpdated: 'August 19, 2025, 1:38:14 PM',
  },
  {
    id: 'flood-relief-2',
    name: 'Emergency Flood Relief',
    description: 'Flood affected families in northern region',
    beneficiaries: 1200,
    lastUpdated: 'August 19, 2025, 1:38:14 PM',
  },
  {
    id: 'flood-relief-3',
    name: 'Emergency Flood Relief',
    description: 'Flood affected families in northern region',
    beneficiaries: 1200,
    lastUpdated: 'August 19, 2025, 1:38:14 PM',
  },
  {
    id: 'flood-relief-4',
    name: 'Emergency Flood Relief',
    description: 'Flood affected families in northern region',
    beneficiaries: 1200,
    lastUpdated: 'August 19, 2025, 1:38:14 PM',
  },
];

export function BeneficiaryGroupsDisbursementForm() {
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

  const filteredGroups = beneficiaryGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedGroupData = beneficiaryGroups.find(
    (group) => group.id === selectedGroup,
  );
  const totalBeneficiaries = selectedGroupData?.beneficiaries || 0;
  const amountPerBeneficiaryNum = Number.parseFloat(amountPerBeneficiary) || 0;
  const totalAmount = totalBeneficiaries * amountPerBeneficiaryNum;

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    console.log('Total amount:', totalAmount);
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
          {filteredGroups?.length ? (
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
                  <RadioGroupItem value={group.id} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {group.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {group.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {group.beneficiaries.toLocaleString()} beneficiaries
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated: {group.lastUpdated}</span>
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
            className="w-full bg-slate-500 hover:bg-slate-600 text-white"
            disabled={!selectedGroup || !amountPerBeneficiary}
          >
            Initiate Transaction
          </Button>
        </form>
      </div>
    </div>
  );
}
