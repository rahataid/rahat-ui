import { useParams } from 'next/navigation';

import {
  useBeneficiariesGroups,
  usePagination,
  useSingleBeneficiaryGroup,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Back,
  ClientSidePagination,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { UUID } from 'crypto';
import { useMemo, useState } from 'react';
import BeneficiariesGroupTable from './beneficiariesGroupTable';
import { PaymentDialog } from './payment.dialog';
import useBeneficiariesGroupTableColumn from './useBeneficiariesGroupTablecolumn';

type PaymentState = {
  method: 'FSP' | 'CVA';
  offline: boolean;
  group: string;
  vendor: string;
};

export default function PaymentInitiation() {
  const { id: projectID } = useParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: beneficiaryGroups, isLoading } = useBeneficiariesGroups(
    projectID as UUID,
    {
      perPage: '100',
      tokenAssigned: true,
    },
  );
  const [groupId, setGroupId] = useState<UUID>();
  const [formState, setFormState] = useState<PaymentState>({
    method: 'CVA',
    offline: false,
    group: '',
    vendor: '',
  });
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const { data: groupDetails, isLoading: groupLoading } =
    useSingleBeneficiaryGroup(projectID as UUID, groupId as UUID);

  const columns = useBeneficiariesGroupTableColumn();
  const tableData = useMemo(() => {
    if (groupDetails) {
      return groupDetails?.groupedBeneficiaries?.map((d: any) => ({
        walletAddress: d?.Beneficiary?.walletAddress,
        name: d?.Beneficiary?.pii?.name,
        total: groupDetails?.groupedBeneficiaries?.length,
      }));
    } else return [];
  }, [groupDetails]);
  const table = useReactTable({
    data: tableData,
    columns: columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  const handleChange = <K extends keyof PaymentState>(
    key: K,
    value: PaymentState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (key === 'group')
      return setGroupId(
        beneficiaryGroups?.data?.find((g) => g.name === value)?.uuid,
      );
  };

  const renderMethodOption = (value: 'FSP' | 'CVA') => (
    <Label
      htmlFor={`method-${value.toLowerCase()}`}
      className={`flex cursor-pointer items-center border p-3 w-32 justify-center rounded-sm space-x-2 ${
        formState.method === value ? 'border-blue-400' : ''
      }`}
    >
      <RadioGroupItem value={value} id={`method-${value.toLowerCase()}`} />
      <span>{value}</span>
    </Label>
  );

  const handleSubmit = () => {
    const data = {
      method: formState.method,
      group: formState.group,
      vendor: formState.vendor,
      token: '10',
      totalBeneficiaries: groupDetails?.groupedBeneficiaries?.length,
    };
    console.log(data);
  };
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectID}/payout`} />
        <div className="mt-4 flex justify-between items-center">
          <Heading
            title="Payout"
            description="Select beneficiary group to initiate payment"
          />
        </div>

        <div className="border rounded-sm p-4 space-y-4 bg-white w-full">
          <div className="flex justify-between">
            {/* Payment Method */}
            <RadioGroup
              defaultValue={formState.method}
              onValueChange={(value) =>
                handleChange('method', value as 'FSP' | 'CVA')
              }
              className="flex items-center space-x-6"
            >
              {renderMethodOption('CVA')}
              {renderMethodOption('FSP')}
            </RadioGroup>

            {/* Online/Offline Toggle */}
            {formState.method === 'CVA' && (
              <div className="flex items-center space-x-3">
                <Switch
                  checked={formState.offline}
                  onCheckedChange={(checked) =>
                    handleChange('offline', checked)
                  }
                  id="offline-switch"
                />
                <Label htmlFor="offline-switch">
                  {formState.offline ? 'Online' : 'Offline'}
                </Label>
              </div>
            )}
          </div>

          {/* Vendor Select - only if online */}
          {formState.offline && formState.method === 'CVA' && (
            <div className="">
              <Label>Vendor</Label>
              <SelectComponent
                name="Vendor"
                options={[
                  'Rumsan Beneficiary Vendor',
                  'Kathmandu Vendor',
                  'Lalitpur Vendor',
                ]}
                value={formState.vendor}
                onChange={(value) => handleChange('vendor', value)}
              />
            </div>
          )}

          {/* Beneficiary Group Select */}
          <div>
            <Label>Beneficiary Group</Label>
            <SelectComponent
              name="Beneficiary Group"
              options={beneficiaryGroups?.data?.map(
                (group: any) => group?.name,
              )}
              value={formState.group}
              onChange={(value) => handleChange('group', value)}
            />
          </div>
          <div className="flex justify-between w-full ">
            {groupId ? (
              <div className="flex flex-col">
                <h1 className="text-base">{groupDetails?.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Total Beneficiaries{' '}
                  {groupDetails?.groupedBeneficiaries?.length}
                </p>
              </div>
            ) : (
              <div />
            )}
            <div className="flex space-x-2 ">
              <Button variant="outline" className="rounded-sm w-48">
                Cancel
              </Button>
              <PaymentDialog
                formState={formState}
                handleSubmit={handleSubmit}
                token={'100'}
                totalBeneficiaries={
                  groupDetails?.groupedBeneficiaries?.length ?? 0
                }
              />
            </div>
          </div>
          {groupId && (
            <div className="my-0 py-0">
              <SearchInput
                name="Beneficiary Wallet"
                className="mb-2 w-full"
                value={
                  (table
                    .getColumn('walletAddress')
                    ?.getFilterValue() as string) ?? ''
                }
                onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                  table
                    .getColumn('walletAddress')
                    ?.setFilterValue(event.target.value)
                }
              />
              <BeneficiariesGroupTable table={table} loading={groupLoading} />
              <ClientSidePagination table={table} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
