import { zodResolver } from '@hookform/resolvers/zod';
import { useBeneficiaryGroups, useFundAssignmentStore } from '@rahat-ui/query';
import { useProjectBalance } from 'apps/rahat-ui/src/hooks/aa/utils';
import { UUID } from 'crypto';
import { cn } from 'libs/shadcn/src';
import { Button } from 'libs/shadcn/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'libs/shadcn/src/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'libs/shadcn/src/components/ui/form';
import { Input } from 'libs/shadcn/src/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'libs/shadcn/src/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const FormSchema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  beneficiaryGroup: z
    .string()
    .min(1, { message: 'Select a beneficiary group' }),
  beneficiaryName: z.string().min(1, { message: 'Select a beneficiary group' }),
  tokenAmountPerBenef: z
    .string()
    .min(1, { message: 'Enter valid amount' })
    .refine((val) => /^\d+$/.test(val), {
      message: 'Amount must be a positive integer',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
  totalTokenAmount: z
    .string()
    .min(1, { message: 'Enter valid amount' })
    .refine((val) => /^\d+$/.test(val), {
      message: 'Amount must be a positive integer',
    }),
  totalTokensReserved: z.number(),
});

type FormValues = z.infer<typeof FormSchema>;

// Explicit empty defaults — used by both useForm and the Clear button
// so form.reset() always returns to a truly blank state
const DEFAULT_VALUES: FormValues = {
  title: '',
  beneficiaryGroup: '',
  beneficiaryName: '',
  tokenAmountPerBenef: '',
  totalTokenAmount: '0',
  totalTokensReserved: 0,
};

// Keys blocked from numeric-only inputs
const BLOCKED_KEYS = [
  ' ',
  'e',
  'E',
  '+',
  '-',
  '.',
  ',',
  '/',
  '*',
  '@',
  '#',
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // A–Z
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), // a–z
];

export default function AssignFundsForm({
  handleStepChange,
}: {
  handleStepChange: (step: number) => void;
}) {
  const params = useParams();
  const projectId = params.id as UUID;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const benGroups = useBeneficiaryGroups(projectId, {
    page: 1,
    perPage: 100,
    tokenAssigned: false,
  });

  const projectBalance = useProjectBalance(projectId);

  const { setAssignedFundData, assignedFundData } = useFundAssignmentStore(
    (state) => ({
      setAssignedFundData: state.setAssignedFundData,
      assignedFundData: state.assignedFundData,
    }),
  );

  const tokenPerBenef = form.watch('tokenAmountPerBenef');
  const selectedGroupId = form.watch('beneficiaryGroup');

  // Pre-fill form when returning from a later step
  useEffect(() => {
    const payload = assignedFundData?.reserveTokenPayload;
    if (!payload) return;
    form.reset({
      title: payload.title ?? '',
      beneficiaryGroup: payload.beneficiaryGroupId ?? '',
      beneficiaryName: payload.beneficiaryName ?? '',
      tokenAmountPerBenef: String(payload.tokenAmountPerBenef ?? ''),
      totalTokenAmount: String(payload.numberOfTokens ?? '0'),
      totalTokensReserved: payload.numberOfTokens ?? 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssignFunds = async (data: FormValues) => {
    if (
      projectBalance === undefined ||
      projectBalance < 0 ||
      isNaN(projectBalance)
    ) {
      toast.error('Insufficient project balance');
      return;
    }

    if (projectBalance! < Number(data.totalTokenAmount)) {
      toast.error('Insufficient project balance to assign funds');
      return;
    }
    const reserveTokenPayload = {
      beneficiaryGroupId: data.beneficiaryGroup,
      numberOfTokens: Number(data.totalTokenAmount),
      title: data.title,
      totalTokensReserved: data.totalTokenAmount,
      beneficiaryName: data.beneficiaryName,
      tokenAmountPerBenef: data.tokenAmountPerBenef,
    };
    const fundData = {
      projectUUID: projectId,
      reserveTokenPayload,
    };

    setAssignedFundData(fundData);

    handleStepChange(1);
  };

  // Recompute total token amount whenever per-beneficiary amount or selected group changes
  useEffect(() => {
    const perBenef = Number(tokenPerBenef || '0');
    const selectedGroup = benGroups.data?.data.find(
      (group: any) => group.uuid === selectedGroupId,
    );
    const count = selectedGroup?._count?.groupedBeneficiaries || 0;
    const total = perBenef * count;

    if (!isNaN(total)) {
      form.setValue('totalTokenAmount', total.toString());
      form.setValue('totalTokensReserved', total);
    }
    // `form` is a stable ref from useForm — intentionally excluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenPerBenef, selectedGroupId, benGroups.data]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAssignFunds)}>
        <div className=" border rounded-sm p-4 flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write token title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="beneficiaryGroup"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3 w-full">
                  <FormLabel className="mt-1">Beneficiary Group</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? benGroups.data?.data.find(
                                (group: any) => group.uuid === field.value,
                              )?.name
                            : 'Select Beneficiary Group'}
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search ..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No group found.</CommandEmpty>
                          <CommandGroup>
                            {benGroups?.data?.data.map((group: any) => (
                              <CommandItem
                                value={group?.uuid}
                                key={group?.uuid}
                                onSelect={() => {
                                  form.setValue(
                                    'beneficiaryGroup',
                                    group?.uuid,
                                    { shouldValidate: true, shouldTouch: true },
                                  );
                                  form.setValue(
                                    'beneficiaryName',
                                    group?.name,
                                    {
                                      shouldValidate: true,
                                      shouldTouch: true,
                                    },
                                  );
                                }}
                              >
                                {group?.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    group?.uuid === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tokenAmountPerBenef"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Token Amount Per Beneficiary</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Write token amount"
                        {...field}
                        onKeyDown={(e) => {
                          if (BLOCKED_KEYS.includes(e.key)) e.preventDefault();
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger('tokenAmountPerBenef');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="totalTokenAmount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Total Token Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-500 text-white"
                      {...field}
                      readOnly
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(DEFAULT_VALUES)}
                className="px-10 rounded-sm w-40"
              >
                Clear
              </Button>

              <Button type="submit" className="px-10 rounded-sm w-40">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
