'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
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
import BeneficiariesGroupTable from '../../payout/initiatePayout/beneficiariesGroupTable';
import useBeneficiariesGroupTableColumn from '../../payout/initiatePayout/useBeneficiariesGroupTablecolumn';
import {
  paymentSchema,
  PaymentSchema,
} from '../../payout/initiatePayout/schemas/payout.validation';
import { PayoutSkeleton } from '../../payout/initiatePayout/pauoutSkeleton';

export type { PaymentSchema as PayoutFormData };

interface PayoutFundManagementFormProps {
  handleStepChange: (step: number) => void;
  onPayoutData: (data: PaymentSchema | null) => void;
  payoutData?: PaymentSchema | null;
}

const initialFormState: PaymentSchema = {
  method: '',
  mode: PayoutMode.ONLINE,
  group: {},
  vendor: {},
  paymentProvider: {},
};

export default function PayoutFundManagementForm({
  handleStepChange,
  onPayoutData,
  payoutData,
}: PayoutFundManagementFormProps) {
  // Router goes here
  const params = useParams();
  const projectID = params.id as UUID;

  // State goes here
  // If returning from confirmation with existing payout data, go straight to form
  const [wantsPayout, setWantsPayout] = useState<boolean | null>(
    payoutData ? true : null,
  );

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
  const form = useForm<PaymentSchema>({
    defaultValues: initialFormState,
    resolver: zodResolver(paymentSchema),
  });
  const { setValue, reset, watch, control } = form;
  const formState = watch();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns = useBeneficiariesGroupTableColumn();

  const { data: groupDetails } = useGetBeneficiaryGroup(groupId);

  // Derived state goes here
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
      setValue('group', { name: groupName, id: groupId });
    }
  }, [payoutTypes]);

  const handleSkip = () => {
    onPayoutData(null);
    handleStepChange(2);
  };

  const handleFormSubmit = (data: PaymentSchema) => {
    onPayoutData(data);
    handleStepChange(2);
  };

  if (wantsPayout === null) {
    return (
      <div className="border rounded-sm p-10 bg-white flex flex-col items-center space-y-6">
        <p className="text-xl font-semibold text-center">
          Do you want to create a payout for the group{' '}
          <span className="text-primary">{groupName}</span> now?
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="w-32 rounded-sm"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <Button
            className="w-32 rounded-sm"
            onClick={() => setWantsPayout(true)}
          >
            Yes
          </Button>
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
        <Button variant="outline" onClick={() => setWantsPayout(null)}>
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
              onValueChange={(value) =>
                reset({
                  ...initialFormState,
                  method: value,
                  group: { name: groupName, id: groupId },
                })
              }
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
                    onCheckedChange={(checked) =>
                      reset({
                        ...initialFormState,
                        method: formState.method,
                        group: { name: groupName, id: groupId },
                        mode: checked ? PayoutMode.ONLINE : PayoutMode.OFFLINE,
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
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium">Beneficiary Group</Label>
              <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 text-sm text-muted-foreground">
                {groupName}
              </div>
            </div>

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
          <div className="flex justify-end mt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-sm w-32"
                onClick={() =>
                  reset({
                    ...initialFormState,
                    group: { name: groupName, id: groupId },
                  })
                }
              >
                Clear
              </Button>
              <Button type="submit" className="rounded-sm w-40">
                Continue
              </Button>
            </div>
          </div>

          {tableData.length > 0 && (
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
