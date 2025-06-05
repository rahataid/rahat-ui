import { zodResolver } from '@hookform/resolvers/zod';
import {
  PROJECT_SETTINGS_KEYS,
  useBeneficiariesGroups,
  useBeneficiariesGroupStore,
  useBeneficiaryGroups,
  useFundAssignmentStore,
  useProjectSettingsStore,
  useReservationStats,
} from '@rahat-ui/query';
import { useReadAaProjectTokenBudget } from 'apps/rahat-ui/src/hooks/aa/contracts/aaProject';
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
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AssignFundsForm() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  const { data: reservationStats, isLoading: isLoadingReservationStats } =
    useReservationStats(projectId);
  const FormSchema = z.object({
    title: z.string().min(4, { message: 'Title must be at least 4 character' }),
    beneficiaryGroup: z
      .string()
      .min(1, { message: 'Select a beneficiary group' }),
    beneficiaryName: z
      .string()
      .min(1, { message: 'Select a beneficiary group' }),
    // tokenAmount: z
    //   .string()
    //   .min(1, { message: 'Enter valid amount' })
    //   .refine(
    //     (val) => {
    //       const num = Number(val);
    //       return !isNaN(num) && num >= 0;
    //     },
    //     { message: 'Amount must be a positive number' },
    //   ),
    tokenAmount: z
      .string()
      .min(1, { message: 'Enter valid amount' })
      .refine((val) => /^\d+$/.test(val), {
        message: 'Amount must be a positive integer',
      }),
    totalTokensReserved: z.number(),
  });

  const contractSettings = useProjectSettingsStore(
    (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const { data: projectBudget } = useReadAaProjectTokenBudget({
    address: contractSettings?.aaproject?.address,
    args: [contractSettings?.rahattoken?.address],
  });

  const parsedProjectBudget = Number(projectBudget);
  const totalReservedTokens =
    reservationStats?.data?.totalReservedTokens?._sum?.benTokens || 0;
  const availableBudget = parsedProjectBudget - totalReservedTokens;
  console.log(projectBudget);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      beneficiaryGroup: '',
      beneficiaryName: '',
      tokenAmount: '',
      totalTokensReserved: 0,
    },
  });

  const benGroups = useBeneficiaryGroups(projectId, {
    page: 1,
    perPage: 100,
    // sort: 'updatedAt',
    // order: 'desc',
    tokenAssigned: false,
  });
  // const { beneficiariesGroups } = useBeneficiariesGroupStore((state) => ({
  //   beneficiariesGroups: state.beneficiariesGroups,
  //   beneficiariesGroupsMeta: state.beneficiariesGroupsMeta,
  // }));

  const { setAssignedFundData } = useFundAssignmentStore((state) => ({
    setAssignedFundData: state.setAssignedFundData,
  }));

  const handleAssignFunds = async (data: z.infer<typeof FormSchema>) => {
    const reserveTokenPayload = {
      beneficiaryGroupId: data.beneficiaryGroup,
      numberOfTokens: Number(data.tokenAmount),
      title: data.title,
      totalTokensReserved: data.tokenAmount,
      beneficiaryName: data.beneficiaryName,
    };
    const fundData = {
      projectUUID: projectId,
      reserveTokenPayload,
    };

    setAssignedFundData(fundData);

    router.push(`/projects/aa/${projectId}/fund-management/confirm`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAssignFunds)}>
        <div className="border rounded-md p-4 flex flex-col space-y-4">
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
          <div className="flex space-x-4 justify-between">
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
                                (group) => group.uuid === field.value,
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
                            {benGroups?.data?.data.map((group) => (
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
              name="tokenAmount"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Token Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Write token amount"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger('tokenAmount');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>

              <Button className="px-10" disabled={!form.formState.isValid}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
