'use client';

import { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Eye, Copy } from 'lucide-react';
import { BeneficiaryProfileView } from './beneficiary-profile-view';

const beneficiariesData = [
  {
    id: 1,
    name: 'Rggg',
    wallet: '0x3ad4...fe02',
    status: 'Verified',
    amount: '2.00 USDC',
  },
  {
    id: 2,
    name: '',
    wallet: '0xa0a2...2a2E',
    status: 'Verified',
    amount: '4.50 USDC',
  },
  {
    id: 3,
    name: 'test report',
    wallet: '0xd783...497E',
    status: 'Verified',
    amount: '1.10 USDC',
  },
  {
    id: 4,
    name: 'test',
    wallet: '0x8cEd...d40d',
    status: 'Verified',
    amount: '200000000002700000.00 USDC',
  },
  {
    id: 5,
    name: 'Aug 27 Ben',
    wallet: '0x284e...8a3C',
    status: 'Verified',
    amount: '2700002.50 USDC',
  },
  {
    id: 6,
    name: 'Surpana',
    wallet: '0x90BD...dE0F',
    status: 'Verified',
    amount: '2600001.10 USDC',
  },
  {
    id: 7,
    name: 'sanjil',
    wallet: '0xFc62...ee3E',
    status: 'Verified',
    amount: '2600009.10 USDC',
  },
  {
    id: 8,
    name: 'anupama',
    wallet: '0x1bb5...cb8e',
    status: 'Verified',
    amount: '2600001.10 USDC',
  },
  {
    id: 9,
    name: 'Test Name',
    wallet: '0x0243...2a3B',
    status: 'Verified',
    amount: '2600114.10 USDC',
  },
  {
    id: 10,
    name: 'dont disburse',
    wallet: '0xd665...C10a',
    status: 'Verified',
    amount: '3600178.10 USDC',
  },
];

export default function BeneficiariesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('beneficiary');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<
    string | null
  >(null);

  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
              C2C
            </span>
            <span className="text-lg font-semibold text-gray-900">Project</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">Connect Wallet</Button>
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex gap-6 border-b border-gray-200">
          <button
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'beneficiary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('beneficiary')}
          >
            Beneficiary
          </button>
          <button
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'beneficiary-groups'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('beneficiary-groups')}
          >
            Beneficiary Groups
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        <Input
          placeholder="Search beneficiary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="px-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                  Wallet Address
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                  Disbursed Amount
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {beneficiariesData.map((beneficiary) => (
                <tr key={beneficiary.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {beneficiary.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 font-mono">
                        {beneficiary.wallet}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {beneficiary.amount}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        setSelectedBeneficiaryId(beneficiary.id.toString())
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedBeneficiaryId && (
        <BeneficiaryProfileView
          beneficiaryId={selectedBeneficiaryId}
          isOpen={!!selectedBeneficiaryId}
          onClose={() => setSelectedBeneficiaryId(null)}
        />
      )}
    </div>
  );
}
