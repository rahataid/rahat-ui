'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PROJECT_SETTINGS_KEYS,
  useBeneficiariesGroupStore,
  useBeneficiariesGroups,
  useProjectSettingsStore,
  useReservationStats,
  useReserveTokenForGroups,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { useReadAaProjectTokenBudget } from 'apps/rahat-ui/src/hooks/aa/contracts/aaProject';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AddFundManagementView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  const fundManagementListPath = `/projects/aa/${projectId}/fund-management`;

  const { data: reservationStats, isLoading: isLoadingReservationStats } =
    useReservationStats(projectId);

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

  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 4 character' }),
    numberOfTokens: z.coerce.number(),
    beneficiaryGroup: z.string(),
    totalTokensReserved: z.number(),
  });

  const reserveTokenForGroups = useReserveTokenForGroups();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      numberOfTokens: 0,
      totalTokensReserved: 0,
    },
  });

  // Watch for changes in the form fields
  const watchTokens = form.watch('numberOfTokens');
  const watchBeneficiaryGroup = form.watch('beneficiaryGroup');
  const watchTotalTokensReserved = form.watch('totalTokensReserved');

  React.useEffect(() => {
    const numberOfTokens = Number(watchTokens);
    const selectedGroup = beneficiariesGroups?.find(
      (g: any) => g?.uuid === watchBeneficiaryGroup,
    );

    if (selectedGroup && numberOfTokens) {
      const groupMembers = selectedGroup?._count?.groupedBeneficiaries;

      form.setValue('totalTokensReserved', numberOfTokens * groupMembers);
    } else {
      form.setValue('totalTokensReserved', 0);
    }
  }, [watchTokens, watchBeneficiaryGroup]);

  useBeneficiariesGroups(projectId, {
    page: 1,
    perPage: 100,
  });

  const { beneficiariesGroups, beneficiariesGroupsMeta } =
    useBeneficiariesGroupStore((state) => ({
      beneficiariesGroups: state.beneficiariesGroups,
      beneficiariesGroupsMeta: state.beneficiariesGroupsMeta,
    }));

  const handleReserveTokenToGroup = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const reserveTokenPayload = {
      beneficiaryGroupId: data.beneficiaryGroup,
      numberOfTokens: Number(data.numberOfTokens),
      title: data.title,
      totalTokensReserved: data.totalTokensReserved,
    };
    try {
      await reserveTokenForGroups.mutateAsync({
        projectUUID: projectId,
        reserveTokenPayload,
      });
      router.push(fundManagementListPath);
    } catch (e) {
      console.error('Creating reserve token::', e);
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
      <div className="w-full rounded bg-card p-4 shadow mb-4">
        <h1 className="text-lg font-semibold mb-6">Reservation Stats</h1>
        {isLoadingReservationStats ? (
          <Loader />
        ) : (
          <div className="grid gap-2">
            <p>Total project budget: {parsedProjectBudget}</p>
            <p>Total reserved budget: {totalReservedTokens}</p>
            <p>Available budget: {availableBudget}</p>
            {watchTotalTokensReserved > availableBudget && (
              <p className="text-red-500">
                Warning: Total reserved tokens exceed the available budget!
              </p>
            )}
          </div>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleReserveTokenToGroup)}>
          <div className="shadow-md p-4 rounded-sm bg-card grid gap-2">
            <h1 className="text-lg font-semibold mb-4">Reserve Funds</h1>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="beneficiaryGroup"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Beneficiary Group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select beneficiary group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {beneficiariesGroups?.map((g: any) => {
                          return (
                            <>
                              <SelectItem value={g?.uuid}>{g?.name}</SelectItem>
                            </>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="numberOfTokens"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>No. of Tokens</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="Enter number of tokens for each members"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <small className="mt-0.5">
              {form.getValues('numberOfTokens')} tokens each will be reserved
              for members of the group. Total reserved tokens will be{' '}
              {form.getValues('totalTokensReserved')}
            </small>

            <div className="hidden">
              <FormField
                control={form.control}
                name="totalTokensReserved"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Total tokens reserved</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="0"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end gap-2 my-4">
              <Button
                type="button"
                onClick={() => router.push(fundManagementListPath)}
                className="text-red-600 bg-red-100 hover:bg-card hover:bg-red-200"
              >
                Cancel
              </Button>
              <Button type="submit">Add Fund Management</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
