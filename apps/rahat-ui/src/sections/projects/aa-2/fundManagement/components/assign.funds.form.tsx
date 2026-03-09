import { zodResolver } from '@hookform/resolvers/zod';
import {
  useBeneficiaryGroups,
  useFundAssignmentStore,
  useValidateTokenAssignment,
} from '@rahat-ui/query';
import { BeneficiaryGroupListItem } from '@rahat-ui/types';
import { useProjectBalance } from 'apps/rahat-ui/src/hooks/aa/utils';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { UUID } from 'crypto';
import dynamic from 'next/dynamic';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  FundAssignmentFormSchema,
  FundAssignmentFormValues,
} from './schemas/funds.validation';

const ErrorInfoPopupModel = dynamic(() => import('./errorInfoPopupModel'));

// Explicit empty defaults — used by both useForm and the Clear button
// so form.reset() always returns to a truly blank state
const DEFAULT_VALUES: FundAssignmentFormValues = {
  title: '',
  beneficiaryGroupId: '',
  tokenAmountPerBenef: 0,
  totalTokenAmount: 0,
};

export default function AssignFundsForm({
  handleStepChange,
}: {
  handleStepChange: (step: number) => void;
}) {
  const params = useParams();
  const projectId = params.id as UUID;

  const errorModule = useBoolean();
  const [errorData, setErrorData] = useState<any>(null);

  const validateTokenAction = useValidateTokenAssignment();

  const form = useForm<FundAssignmentFormValues>({
    resolver: zodResolver(FundAssignmentFormSchema),
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
  const selectedGroupId = form.watch('beneficiaryGroupId');

  // Pre-fill form when returning from a later step
  useEffect(() => {
    const payload = assignedFundData?.reserveTokenPayload;
    if (!payload) return;
    form.reset({
      title: payload.title ?? '',
      beneficiaryGroupId: payload.beneficiaryGroupId ?? '',
      tokenAmountPerBenef: payload.tokenAmountPerBenef ?? 0,
      totalTokenAmount: payload.numberOfTokens ?? 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssignFunds = async (data: FundAssignmentFormValues) => {
    // if (
    //   projectBalance === undefined ||
    //   projectBalance < 0 ||
    //   isNaN(projectBalance)
    // ) {
    //   toast.error('Insufficient project balance');
    //   return;
    // }

    // if (projectBalance < data.totalTokenAmount) {
    //   toast.error('Insufficient project balance to assign funds');
    //   return;
    // }

    const validationResult = (await validateTokenAction.mutateAsync({
      projectUUID: projectId,
      groupId: data.beneficiaryGroupId,
    })) as any;

    if (validationResult?.isAssignable === false) {
      setErrorData(validationResult);
      errorModule.onTrue();
      return;
    }

    const selectedGroup = benGroups.data.find(
      (group) => group.uuid === data.beneficiaryGroupId,
    );

    const reserveTokenPayload = {
      beneficiaryGroupId: data.beneficiaryGroupId,
      numberOfTokens: data.totalTokenAmount,
      title: data.title,
      beneficiaryName: selectedGroup?.name ?? '',
      tokenAmountPerBenef: data.tokenAmountPerBenef,
    };

    setAssignedFundData({ projectUUID: projectId, reserveTokenPayload });
    handleStepChange(1);
  };

  // Recompute total token amount whenever per-beneficiary amount or selected group changes
  useEffect(() => {
    const selectedGroup = benGroups.data.find(
      (group) => group.uuid === selectedGroupId,
    );
    const count = selectedGroup?._count?.groupedBeneficiaries ?? 0;
    const total = tokenPerBenef * count;

    if (!isNaN(total)) {
      form.setValue('totalTokenAmount', total);
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
              name="beneficiaryGroupId"
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
                            ? benGroups.data.find(
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
                            {benGroups.data.map(
                              (group: BeneficiaryGroupListItem) => (
                                <CommandItem
                                  value={group?.uuid}
                                  key={group?.uuid}
                                  onSelect={() => {
                                    form.setValue(
                                      'beneficiaryGroupId',
                                      group?.uuid,
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
                              ),
                            )}
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
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Token Amount Per Beneficiary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Write token amount"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                        form.trigger('tokenAmountPerBenef');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalTokenAmount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Total Token Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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

              <Button
                type="submit"
                className="px-10 rounded-sm w-40"
                disabled={validateTokenAction.isPending}
              >
                {validateTokenAction.isPending ? 'Validating...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      </form>
      <ErrorInfoPopupModel validateModal={errorModule} errorData={errorData} />
    </Form>
  );
}
