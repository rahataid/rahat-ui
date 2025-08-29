'use client';

import { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { BeneficiaryTable } from './createBeneficiaryGroupTable';
import { Heading, SearchInput } from 'apps/rahat-ui/src/common';

// Mock data matching the screenshot
const mockBeneficiaries = [
  {
    id: '1',
    name: 'Tiana Lubin',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '2',
    name: 'Jaylon Korsgaard',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '3',
    name: 'Erin Gouse',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '4',
    name: 'Desirae Rosser',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '5',
    name: 'Madelyn Carder',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '6',
    name: 'Jaydon Bator',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '7',
    name: 'Marley Dokidis',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '8',
    name: 'Anika Franci',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '9',
    name: 'Abram Rosser',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
  {
    id: '10',
    name: 'Ryan Baptista',
    phoneNumber: '+977-9877645362',
    walletAddress: '0x3ad4...f54',
  },
];

export default function CreateBeneficiaryGroup() {
  const [groupName, setGroupName] = useState('');
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([
    '1',
    '2',
    '3',
    '4',
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBeneficiaries = mockBeneficiaries.filter((beneficiary) =>
    beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClear = () => {
    setSelectedBeneficiaries([]);
  };

  const handleAddBeneficiaries = () => {
    console.log('Adding beneficiaries:', selectedBeneficiaries);
    console.log('Group name:', groupName);
    // Handle the actual creation logic here
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50">
      {/* Header */}
      <Heading
        title="Create Beneficiary Group"
        description="Select beneficiaries from the list below to create a group"
      />

      {/* Group Name Input */}
      <div className="space-y-2">
        <Label htmlFor="groupName" className="text-sm font-medium">
          Beneficiary Group Name
        </Label>
        <Input
          id="groupName"
          placeholder="Write beneficiary group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="border rounded-sm p-4">
        {/* Select Beneficiaries Section */}
        <div className="space-y-4">
          <Heading
            title="Select Beneficiaries"
            titleStyle="text-lg font-semibold"
            description="Select beneficiaries from the list below to create a group"
          />

          {/* Search Input */}
          <SearchInput
            name="beneficiary name"
            onSearch={(e) => setSearchQuery(e.target.value)}
          />

          {/* Beneficiary Table */}
          <BeneficiaryTable
            data={filteredBeneficiaries}
            selectedBeneficiaries={selectedBeneficiaries}
            onSelectionChange={setSelectedBeneficiaries}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button
            onClick={handleAddBeneficiaries}
            disabled={selectedBeneficiaries.length === 0}
          >
            Add ({selectedBeneficiaries.length} beneficiaries)
          </Button>
        </div>
      </div>
    </div>
  );
}
