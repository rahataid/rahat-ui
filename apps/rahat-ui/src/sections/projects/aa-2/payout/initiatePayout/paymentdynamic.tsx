'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';

import {
  PayoutMode,
  PayoutType,
  PROJECT_SETTINGS_KEYS,
  useAAVendorsList,
  useBeneficiariesGroups,
  useCreatePayout,
  usePaymentProviders,
  useTabConfiguration,
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

import BeneficiariesGroupTable from './beneficiariesGroupTable';
import useBeneficiariesGroupTableColumn from './useBeneficiariesGroupTablecolumn';
import { PaymentDialog } from './payment.dialog';
import { PayoutSkeleton } from './pauoutSkeleton';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema } from './schemas/payout.validation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import DropdownSearch from 'apps/rahat-ui/src/common/search.dropdown';

export interface PaymentState {
  method: string; // dynamic payout type key
  mode: PayoutMode;
  group: Record<string, any>;
  vendor: Record<string, any>;
  paymentProvider: Record<string, any>;
}

const initialFormState: PaymentState = {
  method: '',
  mode: PayoutMode.ONLINE,
  group: {},
  vendor: {},
  paymentProvider: {},
};

export default function PaymentInitiation() {
  const params = useParams();
  const projectID = params.id as UUID;
  const router = useRouter();
  const { data: payoutTypes, isLoading } = useTabConfiguration(
    projectID as UUID,
    PROJECT_SETTINGS_KEYS.PAYOUT_TYPE_CONFIG,
  );

  const form = useForm({
    defaultValues: initialFormState,
    resolver: zodResolver(paymentSchema),
  });

  const { setValue, reset, watch, trigger, control } = form;

  // const [formState, setFormState] = useState<PaymentState>(initialFormState);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const formState = watch();

  const { data: paymentProviders, isLoading: isPaymentProvidersLoading } =
    usePaymentProviders({
      projectUUID: projectID,
    });
  const { data: beneficiaryGroups, isLoading: isBeneficiaryGroupsLoading } =
    useBeneficiariesGroups(projectID, {
      perPage: '100',
      tokenAssigned: true,
      hasPayout: false,
    });
  const { data: vendors, isLoading: isVendorsLoading } = useAAVendorsList({
    projectUUID: projectID,
    page: 1,
    perPage: 100,
    order: 'desc',
    sort: 'createdAt',
  });

  const initiatePayout = useCreatePayout();
  const columns = useBeneficiariesGroupTableColumn();

  // prepare table data based on selected group
  const tableData = useMemo(() => {
    const group = formState.group;
    if (!group?.groupedBeneficiaries?.length) return [];

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
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  });

  const handleSubmit = async () => {
    if (!formState.method || !formState.group) return;

    const payload: any = {
      type: formState.method === 'CVA' ? PayoutType.VENDOR : formState.method,
      mode: formState.mode,
      groupId: formState.group?.tokensReserved?.uuid,
    };

    if (formState.paymentProvider?.id) {
      payload.payoutProcessorId = formState.paymentProvider.id;
      payload.extras = {
        paymentProviderName: formState.paymentProvider.name,
        paymentProviderType: formState.paymentProvider.type,
      };
    }

    if (formState.vendor?.uuid) {
      payload.payoutProcessorId = formState.vendor.uuid;
      payload.extras = {
        vendorName: formState.vendor.name,
        location: formState.vendor.location,
        contactNumber: formState.vendor.phone,
      };
    }

    await initiatePayout.mutateAsync({ projectUUID: projectID, payload });
    router.push(`/projects/aa/${projectID}/payout`);
  };

  useEffect(() => {
    if (payoutTypes?.value.types.length) {
      setValue('method', payoutTypes.value.types[0].key);
    }
  }, [payoutTypes]);

  if (!formState || isLoading) {
    return <PayoutSkeleton />;
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <form action="POST">
          <div className="flex flex-col space-y-0">
            <Back path={`/projects/aa/${projectID}/payout`} />
            <div className="mt-4 flex justify-between items-center">
              <Heading
                title="Create Payout"
                description="Select beneficiary group to initiate payment"
              />
            </div>
          </div>

          {payoutTypes && payoutTypes?.value?.types?.length > 0 ? (
            <div className="border rounded-sm p-4 space-y-4 bg-white w-full">
              <div className="flex justify-between">
                <RadioGroup
                  value={formState.method}
                  onValueChange={(value) =>
                    reset({ ...initialFormState, method: value })
                  }
                  className="flex items-center space-x-6 mb-2 w-auto"
                >
                  {payoutTypes?.value.types.map((type) => (
                    <Label
                      key={type.key}
                      htmlFor={`method-${type.key.toLowerCase()}`}
                      className={`flex cursor-pointer items-center border p-3 w-auto justify-center rounded-sm space-x-2 ${
                        formState.method === type.key ? 'border-blue-400' : ''
                      }`}
                    >
                      <RadioGroupItem
                        value={type.key}
                        id={`method-${type.key.toLowerCase()}`}
                      />
                      <span>{type.label}</span>
                    </Label>
                  ))}
                </RadioGroup>

                {formState.method &&
                  payoutTypes?.value?.types.find(
                    (t) => t.key === formState.method,
                  )?.toggle && (
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={formState.mode === PayoutMode.ONLINE}
                        onCheckedChange={(checked) =>
                          reset({
                            ...initialFormState,
                            method: formState.method,
                            mode: checked
                              ? PayoutMode.ONLINE
                              : PayoutMode.OFFLINE,
                          })
                        }
                        id="mode-switch"
                      />
                      <Label htmlFor="mode-switch">
                        {formState.mode === PayoutMode.ONLINE
                          ? 'Online'
                          : 'Offline'}
                      </Label>
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="group"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 w-full">
                      <FormLabel className="mt-1">Beneficiary Group</FormLabel>
                      <DropdownSearch
                        selectedLabel={field.value?.name}
                        placeholder="Select Beneficiary Group"
                        searchPlaceholder="Search beneficiary group..."
                        emptyMessage="No beneficiary group found."
                        isLoading={isBeneficiaryGroupsLoading}
                        options={
                          beneficiaryGroups?.data?.map((p: any) => ({
                            label: p.name,
                            value: p.id,
                            data: p,
                          })) || []
                        }
                        onSelect={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formState.method && formState.mode === PayoutMode.OFFLINE && (
                  <FormField
                    control={control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-3 w-full">
                        <FormLabel className="mt-1">Vendor</FormLabel>
                        <DropdownSearch
                          selectedLabel={field.value?.name}
                          placeholder="Select Vendor"
                          searchPlaceholder="Search vendor..."
                          emptyMessage="No vendor found."
                          isLoading={isVendorsLoading}
                          options={
                            vendors?.data?.map((v: any) => ({
                              label: v.name,
                              value: v.uuid,
                              data: v,
                            })) || []
                          }
                          onSelect={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {formState.method &&
                  payoutTypes?.value?.types.find(
                    (t) => t.key === formState.method,
                  )?.payoutmethod && (
                    <FormField
                      control={control}
                      name="paymentProvider"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3 w-full">
                          <FormLabel className="mt-1">Payout Method</FormLabel>
                          <DropdownSearch
                            selectedLabel={field.value?.name}
                            placeholder="Select Payment Provider"
                            searchPlaceholder="Search provider..."
                            emptyMessage="No provider found."
                            isLoading={isPaymentProvidersLoading}
                            options={
                              paymentProviders?.map((p: any) => ({
                                label: p.name,
                                value: p.id,
                                data: p,
                              })) || []
                            }
                            onSelect={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  className="rounded-sm w-48"
                  type="button"
                  onClick={() => reset(initialFormState)}
                >
                  Clear
                </Button>
                <PaymentDialog
                  formState={formState}
                  handleSubmit={handleSubmit}
                  shouldTriggerDialog={trigger}
                />
              </div>

              {Object.keys(formState?.group || {}).length > 0 && (
                <>
                  <div className="flex justify-between mt-4">
                    <div className="flex flex-col">
                      <h1 className="text-lg font-semibold">
                        Selected: {formState.group.name}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {formState.group.groupedBeneficiaries?.length} Total
                        Beneficiaries
                      </p>
                    </div>
                  </div>

                  <div className="my-0 py-0">
                    <SearchInput
                      name=""
                      className="mb-2 w-full"
                      value={
                        (table
                          .getColumn('walletAddress')
                          ?.getFilterValue() as string) ?? ''
                      }
                      onSearch={(e) =>
                        table
                          .getColumn('walletAddress')
                          ?.setFilterValue(e.target.value)
                      }
                    />
                    <BeneficiariesGroupTable table={table} />
                    <ClientSidePagination table={table} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center mt-3 bg-gray-50 p-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-3">
                <AlertCircle className="text-red-500 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-3">
                Attention
              </h2>
              <p className="text-center text-gray-600 max-w-2xl mb-8 leading-relaxed">
                No payout type configured. Please configure payout types in
                Settings before creating a payout.
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
