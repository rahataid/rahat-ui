import { useState } from 'react';
import { Calendar, Eye, Check, X, Users, User } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { SearchInput } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

interface Transaction {
  id: string;
  title: string;
  beneficiaries: string;
  totalAmount: string;
  currency: string;
  type: 'Group' | 'Individual';
  createdDate: string;
  perBeneficiary?: string;
  status: 'successful' | 'failed';
  completed: boolean;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Emergency Flood Relief',
    beneficiaries: '10 beneficiaries',
    totalAmount: '100,000',
    currency: 'USDC',
    type: 'Group',
    createdDate: 'August 19, 2025, 1:38:14 PM',
    perBeneficiary: '1,000 USDC',
    status: 'successful',
    completed: true,
  },
  {
    id: '2',
    title: 'Emergency Flood Relief',
    beneficiaries: '0.3 sqft. /54',
    totalAmount: '100,000',
    currency: 'USDC',
    type: 'Individual',
    createdDate: 'August 19, 2025, 1:38:14 PM',
    status: 'successful',
    completed: true,
  },
  {
    id: '3',
    title: 'Emergency Flood Relief',
    beneficiaries: '0.3 sqft. /54',
    totalAmount: '100,000',
    currency: 'USDC',
    type: 'Individual',
    createdDate: 'August 19, 2025, 1:38:14 PM',
    status: 'failed',
    completed: true,
  },
  {
    id: '4',
    title: 'Emergency Flood Relief',
    beneficiaries: '10 beneficiaries',
    totalAmount: '100,000',
    currency: 'USDC',
    type: 'Group',
    createdDate: 'August 19, 2025, 1:38:14 PM',
    perBeneficiary: '1,000 USDC',
    status: 'successful',
    completed: true,
  },
];

export function DisbursementHistoryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('');

  return (
    <div className="p-4 border bg-card rounded-sm mt-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <SearchInput
          className="w-full"
          name="disbursements"
          value={searchQuery}
          onSearch={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="group">Group</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction Cards */}
      <ScrollArea className="h-[calc(100vh-310px)]">
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div className="border p-4 rounded-sm space-y-2">
              <div className="flex justify-between space-x-4">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {transaction.type === 'Group' ? (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm/6 font-medium text-gray-900">
                      {transaction.title}
                    </h3>
                    <p className="text-sm/4 text-gray-700 mb-3">
                      {transaction.beneficiaries}
                    </p>
                  </div>
                </div>
                <div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-xs font-medium"
                  >
                    Completed
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                    TOTAL AMOUNT
                  </p>
                  <p className="text-sm">
                    {transaction.totalAmount} {transaction.currency}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                    TYPE
                  </p>
                  <p className="text-sm">{transaction.type}</p>
                </div>
                {transaction.perBeneficiary && (
                  <div>
                    <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                      PER BENEFICIARY
                    </p>
                    <p className="text-sm">{transaction.perBeneficiary}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                    CREATED DATE
                  </p>
                  <p className="text-sm">{transaction.createdDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {transaction.status === 'successful' ? (
                    <>
                      <div className="flex items-center space-x-1">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          999 successful
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-1">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          999 successful
                        </span>
                      </div>
                    </>
                  )}
                  {transaction.status === 'failed' && (
                    <div className="flex items-center space-x-1">
                      <X className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">1 failed</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
