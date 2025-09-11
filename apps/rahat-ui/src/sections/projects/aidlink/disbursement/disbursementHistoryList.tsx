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
import { NoResult, SearchInput, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  DisbursementSelectionType,
  useGetDisbursements,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export function DisbursementHistoryList() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();

  const { data: disbursements, isLoading: loadingDisbursements } =
    useGetDisbursements({
      projectUUID,
      page: 1,
      perPage: 10,
    });

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
            <SelectItem value={DisbursementSelectionType.GROUP}>
              Group
            </SelectItem>
            <SelectItem value={DisbursementSelectionType.INDIVIDUAL}>
              Individual
            </SelectItem>
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
          {!loadingDisbursements ? (
            disbursements?.length > 0 ? (
              disbursements?.map((disbursement: any) => (
                <div className="border p-4 rounded-sm space-y-2">
                  <div className="flex justify-between space-x-4">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        {disbursement.disbursementType ===
                        DisbursementSelectionType.GROUP ? (
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
                          N/A
                        </h3>
                        <p className="text-sm/4 text-gray-700 mb-3">
                          {disbursement.disbursementType ===
                          DisbursementSelectionType.GROUP
                            ? disbursement.DisbursementBeneficiary?.length
                            : truncateEthAddress(
                                disbursement.DisbursementBeneficiary[0]
                                  .beneficiaryWalletAddress || '',
                              )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {capitalizeFirstLetter(disbursement.status || '')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                        TOTAL AMOUNT
                      </p>
                      <p className="text-sm">{disbursement.amount} USDC</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                        TYPE
                      </p>
                      <p className="text-sm">{disbursement.disbursementType}</p>
                    </div>
                    {disbursement.disbursementType ===
                      DisbursementSelectionType.GROUP && (
                      <div>
                        <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                          PER BENEFICIARY
                        </p>
                        <p className="text-sm">{disbursement.amount} USDC</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 mb-1 text-xs tracking-widest font-semibold">
                        CREATED DATE
                      </p>
                      <p className="text-sm">
                        {dateFormat(disbursement.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          0 successful
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">0 failed</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 bg-transparent"
                    onClick={() =>
                      router.push(
                        `/projects/aidlink/${projectUUID}/disbursement/${disbursement.uuid}`,
                      )
                    }
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Button>
                </div>
              ))
            ) : (
              <NoResult />
            )
          ) : (
            <SpinnerLoader />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
