'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, ChevronDown, X } from 'lucide-react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  PayoutMode,
  PROJECT_SETTINGS_KEYS,
  useAAVendorsList,
  useFundAssignmentStore,
  useGetBeneficiaryGroup,
  usePaymentProviders,
  useTabConfiguration,
} from '@rahat-ui/query';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';

import DropdownSearch from 'apps/rahat-ui/src/common/search.dropdown';
import { ClientSidePagination, SearchInput } from 'apps/rahat-ui/src/common';
import BeneficiariesGroupTable from 'apps/rahat-ui/src/sections/projects/aa-2/payout/initiatePayout/beneficiariesGroupTable';
import { PayoutSkeleton } from 'apps/rahat-ui/src/sections/projects/aa-2/payout/initiatePayout/pauoutSkeleton';
import {
  PaymentSchema,
  payoutFundSchema,
  FundWithPayoutSchema,
} from 'apps/rahat-ui/src/sections/projects/aa-2/payout/initiatePayout/schemas/payout.validation';
import useBeneficiariesGroupTableColumn from 'apps/rahat-ui/src/sections/projects/aa-2/payout/initiatePayout/useBeneficiariesGroupTablecolumn';

export type { PaymentSchema as PayoutFormData };

interface PayoutFundManagementFormProps {
  handleStepChange: (step: number) => void;
  onPayoutData: (data: FundWithPayoutSchema | null) => void;
  payoutData?: FundWithPayoutSchema | null;
  wantsPayout: boolean | null;
  onWantsPayoutChange: (value: boolean | null) => void;
}

const initialFormState: FundWithPayoutSchema = {
  method: '',
  mode: PayoutMode.ONLINE,
  vendor: {},
  paymentProvider: {},
};

export default function PayoutFundManagementForm({
  handleStepChange,
  onPayoutData,
  payoutData,
  wantsPayout,
  onWantsPayoutChange,
}: PayoutFundManagementFormProps) {
  // Router goes here
  const params = useParams();
  const projectID = params.id as UUID;

  // State goes here
  // Always show the "do you want a payout?" question on mount.
  // If payoutData exists (returning from confirmation), the form will be
  // pre-filled once the user clicks "Yes" again.

  // Store goes here
  const { assignedFundData } = useFundAssignmentStore((s) => ({
    assignedFundData: s.assignedFundData,
  }));
  const groupName =
    assignedFundData?.reserveTokenPayload?.beneficiaryName ?? 'this group';
  const groupId =
    assignedFundData?.reserveTokenPayload?.beneficiaryGroupId ?? '';

  // Query goes here
  const { data: payoutTypes, isLoading: isPayoutLoading } = useTabConfiguration(
    projectID,
    PROJECT_SETTINGS_KEYS.PAYOUT_TYPE_CONFIG,
  );
  const { data: paymentProviders, isLoading: isPaymentProvidersLoading } =
    usePaymentProviders({ projectUUID: projectID });
  const { data: vendors, isLoading: isVendorsLoading } = useAAVendorsList({
    projectUUID: projectID,
    page: 1,
    perPage: 100,
    order: 'desc',
    sort: 'createdAt',
  });

  // React Form goes here
  const form = useForm<FundWithPayoutSchema>({
    defaultValues: initialFormState,
    resolver: zodResolver(payoutFundSchema),
  });
  const { setValue, reset, watch, control } = form;
  const formState = watch();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns = useBeneficiariesGroupTableColumn();

  const {
    data: groupDetails,
    isLoading: isGroupLoading,
    isError: isGroupError,
  } = useGetBeneficiaryGroup(groupId as UUID);

  // Derived state goes here
  const vendorOptions = useMemo(
    () =>
      vendors?.data?.map((v: any) => ({
        label: v.name,
        value: v.uuid,
        data: v,
      })) ?? [],
    [vendors],
  );

  const paymentProviderOptions = useMemo(
    () =>
      paymentProviders?.map((p: any) => ({
        label: p.name,
        value: p.id,
        data: p,
      })) ?? [],
    [paymentProviders],
  );

  const tableData = useMemo(() => {
    const beneficiaries = groupDetails?.data?.groupedBeneficiaries ?? [];
    const totalTokens =
      assignedFundData?.reserveTokenPayload?.numberOfTokens ?? 0;
    const tokensPerBeneficiary = beneficiaries.length
      ? totalTokens / beneficiaries.length
      : 0;
    return beneficiaries.map((d: any) => ({
      walletAddress: d?.Beneficiary?.walletAddress,
      assignedTokens: tokensPerBeneficiary,
    }));
  }, [groupDetails, assignedFundData]);

  const table = useReactTable({
    data: tableData,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  });

  // Tracks whether the form has been initialized so the effect never fires again
  // after submit (payoutTypes re-rendering would otherwise call reset() and wipe the form)
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    if (!payoutTypes?.value?.types?.length) return;

    hasInitialized.current = true;

    if (payoutData) {
      reset({ ...payoutData });
    } else {
      setValue('method', payoutTypes.value.types[0].key);
    }
  }, [payoutTypes]);

  const handleSkip = () => {
    onPayoutData(null);
    handleStepChange(2);
  };

  const handleFormSubmit = (data: FundWithPayoutSchema) => {
    onPayoutData(data);
    handleStepChange(2);
  };

  if (wantsPayout === null) {
    return (
      <div className="border rounded-sm p-10 bg-white flex flex-col items-center space-y-6">
        <p className="text-2xl font-bold text-center">
          Do you want to create a payout for the group{' '}
          <span className="text-primary">{groupName}</span> now?
        </p>

        <div className="w-full max-w-xl flex flex-col gap-4 mt-2">
          {/* Info card — Create Payout */}
          <div
            style={{ borderRadius: '0.5rem' }}
            className="flex items-start gap-4 w-full border p-5"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base">Create Payout</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Proceed to configure payout details, review beneficiary
                information, and set up fund distribution.
              </p>
            </div>
          </div>

          {/* Info card — Skip for Now */}
          <div
            style={{ borderRadius: '0.5rem' }}
            className="flex items-start gap-4 w-full border p-5"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
              <X className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base">Skip for Now</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                You can create a payout later from the{' '}
                <span className="text-primary font-semibold">Payout</span>{' '}
                section anytime.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-sm"
              onClick={handleSkip}
            >
              Skip for Now
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-sm"
              onClick={() => onWantsPayoutChange(true)}
            >
              Create Payout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isPayoutLoading) {
    return <PayoutSkeleton />;
  }

  // No payout types configured
  if (!payoutTypes?.value?.types?.length) {
    return (
      <div className="flex flex-col justify-center items-center mt-3 bg-gray-50 p-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-3">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-3">Attention</h2>
        <p className="text-center text-gray-600 max-w-2xl mb-6 leading-relaxed">
          No payout type configured. Please configure payout types in Settings
          before creating a payout.
        </p>
        <Button variant="outline" onClick={() => onWantsPayoutChange(null)}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="border rounded-sm p-4 space-y-4 bg-white w-full">
          <div className="flex justify-between">
            <RadioGroup
              value={formState.method}
              onValueChange={(value) => {
                reset({ ...initialFormState, method: value });
              }}
              className="flex items-center space-x-6 mb-2"
            >
              {payoutTypes.value.types.map((type: any) => (
                <Label
                  key={type.key}
                  htmlFor={`method-${type.key.toLowerCase()}`}
                  className={`flex cursor-pointer items-center border p-3 justify-center rounded-sm space-x-2 ${
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
              payoutTypes.value.types.find(
                (t: any) => t.key === formState.method,
              )?.toggle && (
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formState.mode === PayoutMode.ONLINE}
                    onCheckedChange={(checked) => {
                      setValue(
                        'mode',
                        checked ? PayoutMode.ONLINE : PayoutMode.OFFLINE,
                      );
                      setValue('vendor', {});
                      setValue('paymentProvider', {});
                    }}
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
            <FormItem className="flex flex-col space-y-3 w-full">
              <FormLabel className="mt-1">Beneficiary Group</FormLabel>
              <Button
                type="button"
                variant="outline"
                disabled
                className="w-full justify-between font-normal text-muted-foreground bg-gray-200 cursor-not-allowed opacity-100"
              >
                {groupName}
                <ChevronDown className="opacity-50" />
              </Button>
            </FormItem>

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
                      options={vendorOptions}
                      onSelect={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {formState.method &&
              payoutTypes.value.types.find(
                (t: any) => t.key === formState.method,
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
                        options={paymentProviderOptions}
                        onSelect={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
          </div>
          <div className="flex justify-end mt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-sm w-32"
                onClick={() => reset(initialFormState)}
              >
                Clear
              </Button>
              <Button type="submit" className="rounded-sm w-40">
                Continue
              </Button>
            </div>
          </div>

          {/* Dummy skeleton loading */}
          {isGroupLoading && (
            <div className="space-y-3 mt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          )}
          {isGroupError && (
            <p className="text-sm text-destructive">
              Failed to load beneficiaries.
            </p>
          )}
          {!isGroupLoading && !isGroupError && tableData.length > 0 && (
            <div className="mt-2">
              <div className="w-full flex flex-col gap-2 mb-2">
                <div>
                  <p className="text-sm font-semibold">{groupName}</p>
                  <p className="text-xs text-muted-foreground">
                    {tableData.length} beneficiaries
                  </p>
                </div>
                <SearchInput
                  name=""
                  className="w-full"
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
              </div>
              <BeneficiariesGroupTable table={table} />
              <ClientSidePagination table={table} />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
