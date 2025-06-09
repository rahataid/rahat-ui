import { useMemo, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { UUID } from 'crypto';

import {
  PayoutMode,
  PayoutType,
  useAAVendorsList,
  useBeneficiariesGroups,
  useCreatePayout,
  usePagination,
  usePaymentProviders,
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

import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';

import BeneficiariesGroupTable from './beneficiariesGroupTable';
import { PaymentDialog } from './payment.dialog';
import useBeneficiariesGroupTableColumn from './useBeneficiariesGroupTablecolumn';

export interface PaymentState {
  method: PayoutType;
  mode: PayoutMode;
  group: Record<string, any>;
  vendor: Record<string, any>;
  paymentProvider: Record<string, any>;
}

const initialFormState: PaymentState = {
  method: PayoutType.FSP,
  mode: PayoutMode.ONLINE,
  group: {},
  vendor: {},
  paymentProvider: {},
};

export default function PaymentInitiation() {
  const params = useParams();
  const projectID = params.id as UUID;

  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: paymentProviders } = usePaymentProviders({
    projectUUID: projectID,
  });

  const { data: beneficiaryGroups } = useBeneficiariesGroups(projectID, {
    perPage: '100',
    tokenAssigned: true,
    hasPayout: false,
  });
  const [formState, setFormState] = useState<PaymentState>(initialFormState);
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const { data: vendors } = useAAVendorsList({
    projectUUID: projectID,
    page: 1,
    perPage: 100,
    order: 'desc',
    sort: 'createdAt',
  });

  const initiatePayout = useCreatePayout();

  const columns = useBeneficiariesGroupTableColumn();

  const tableData = useMemo(() => {
    const group = formState.group;

    if (
      Object.keys(group).length === 0 ||
      group.groupedBeneficiaries.length === 0
    ) {
      return [];
    }

    const totalTokens = group.tokensReserved?.numberOfTokens || 0;
    const beneficiaryCount = group.groupedBeneficiaries.length;
    const tokensPerBeneficiary = totalTokens / beneficiaryCount;

    return group.groupedBeneficiaries.map((d: any) => ({
      walletAddress: d?.Beneficiary?.walletAddress,
      assignedTokens: tokensPerBeneficiary,
    }));
  }, [formState.group]);

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

  console.log(paymentProviders);
  const handleChange = <K extends keyof PaymentState>(
    key: K,
    value: PaymentState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (key === 'method' && value !== formState.method) {
      setFormState({ ...initialFormState, method: value as PayoutType });
    }
    if (key === 'mode' && value !== formState.mode) {
      setFormState({
        ...initialFormState,
        method: formState.method,
        mode: value as PayoutMode,
      });
    }
  };

  const renderMethodOption = (value: PayoutType) => (
    <Label
      htmlFor={`method-${value.toLowerCase()}`}
      className={`flex cursor-pointer items-center border p-3 w-32 justify-center rounded-sm space-x-2 ${
        formState.method === value ? 'border-blue-400' : ''
      }`}
    >
      <RadioGroupItem value={value} id={`method-${value.toLowerCase()}`} />
      <span>
        {value === PayoutType.VENDOR ? capitalizeFirstLetter(value) : value}
      </span>
    </Label>
  );

  const handleSubmit = async () => {
    let payload;

    switch (formState.method) {
      case PayoutType.FSP:
        payload = {
          type: PayoutType.FSP,
          mode: PayoutMode.ONLINE,
          groupId: formState?.group?.tokensReserved?.uuid,
          payoutProcessorId: formState?.paymentProvider?.id,
          extras: {
            paymentProviderName: formState?.paymentProvider?.name,
            paymentProviderType: formState?.paymentProvider?.type,
          },
        };
        break;
      case PayoutType.VENDOR:
        switch (formState.mode) {
          case PayoutMode.ONLINE:
            payload = {
              type: PayoutType.VENDOR,
              mode: PayoutMode.ONLINE,
              groupId: formState?.group?.tokensReserved?.uuid,
            };
            break;
          case PayoutMode.OFFLINE:
            payload = {
              type: PayoutType.VENDOR,
              mode: PayoutMode.OFFLINE,
              groupId: formState?.group?.tokensReserved?.uuid,
              payoutProcessorId: formState?.vendor?.uuid,
              extras: {
                vendorName: formState?.vendor?.name,
                location: formState?.vendor?.location,
                contactNumber: formState?.vendor?.phone,
              },
            };
            break;
        }
    }

    if (!payload) {
      return;
    }

    await initiatePayout.mutateAsync({
      projectUUID: projectID,
      payload: payload,
    });
    router.push(`/projects/aa/${projectID}/payout`);
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
          {/* Payment Method */}
          <RadioGroup
            defaultValue={formState.method}
            onValueChange={(value) =>
              handleChange('method', value as PayoutType)
            }
            className="flex items-center space-x-6 mb-2"
          >
            {renderMethodOption(PayoutType.FSP)}
            {renderMethodOption(PayoutType.VENDOR)}
          </RadioGroup>

          {/* Online/Offline Toggle */}
          {formState.method === PayoutType.VENDOR && (
            <div className="flex items-center space-x-3">
              <Switch
                checked={formState.mode === PayoutMode.OFFLINE ? true : false}
                onCheckedChange={(checked) =>
                  handleChange(
                    'mode',
                    checked ? PayoutMode.OFFLINE : PayoutMode.ONLINE,
                  )
                }
                id="offline-switch"
              />
              <Label htmlFor="offline-switch">
                {/* {capitalizeFirstLetter(formState.mode)} */}
                Offline
              </Label>
            </div>
          )}

          {/* Vendor Select - only if online */}
          {formState.mode === PayoutMode.OFFLINE &&
            formState.method === PayoutType.VENDOR && (
              <div className="flex flex-col space-y-1">
                <Label className="font-medium text-sm/6">Vendor</Label>
                <SelectComponent
                  name="Vendor"
                  options={vendors?.data?.map((vendor: any) => vendor?.name)}
                  value={formState.vendor?.name || ''}
                  onChange={(value) => {
                    const selectedVendor = vendors?.data?.find(
                      (vendor: any) => vendor.name === value,
                    );
                    handleChange('vendor', selectedVendor);
                  }}
                />
              </div>
            )}

          <div
            className={`grid ${
              formState.method === PayoutType.FSP
                ? 'grid-cols-2'
                : 'grid-cols-1'
            } gap-4`}
          >
            {/* Beneficiary Group Select */}
            <div className="flex flex-col space-y-1">
              <Label className="font-medium text-sm/6">Beneficiary Group</Label>
              <SelectComponent
                name="Beneficiary Group"
                options={beneficiaryGroups?.data?.map(
                  (group: any) => group?.name,
                )}
                value={formState.group?.name || ''}
                onChange={(value) => {
                  const selectedGroup = beneficiaryGroups?.data?.find(
                    (group: any) => group.name === value,
                  );
                  handleChange('group', selectedGroup);
                }}
              />
            </div>

            {/* Select Payment Provider */}
            {formState.method === PayoutType.FSP && (
              <div className="flex flex-col space-y-1">
                <Label className="font-medium text-sm/6">
                  Payment Provider
                </Label>
                <SelectComponent
                  name="payment provider"
                  options={paymentProviders?.map((p: any) => p?.name)}
                  value={formState.paymentProvider?.name || ''}
                  onChange={(value) => {
                    const selectedPaymentProvider = paymentProviders?.find(
                      (p: any) => p.name === value,
                    );
                    handleChange('paymentProvider', selectedPaymentProvider);
                  }}
                />
              </div>
            )}
          </div>

          {Object.keys(formState?.group).length !== 0 ? (
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">
                Selected: {formState?.group?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {formState?.group?.groupedBeneficiaries?.length} Total
                Beneficiaries
              </p>
            </div>
          ) : (
            <div />
          )}

          {Object.keys(formState?.group).length !== 0 && (
            <div className="my-0 py-0">
              <SearchInput
                name=""
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
              <BeneficiariesGroupTable table={table} />
              <ClientSidePagination table={table} />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" className="rounded-sm w-48">
              Cancel
            </Button>
            <PaymentDialog formState={formState} handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
