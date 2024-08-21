import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCommunityTargetingStore,
  useFieldDefinitionsList,
  useTargetingCreate,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import TargetingFormBuilder from '../../../targetingFormBuilder';
import useTargetingFormStore from '../../../targetingFormBuilder/form.store';
import { ITargetingQueries } from '../../../types/targeting';

import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FIELD_DEF_FETCH_LIMIT } from 'apps/community-tool-ui/src/constants/app.const';
import { MultiSelect } from 'apps/community-tool-ui/src/targetingFormBuilder/MultiSelect';
import { useRouter } from 'next/navigation';
import {
  bankedStatusOptions,
  genderOptions,
  internetStatusOptions,
  phoneStatusOptions,
} from '../../../constants/targeting.const';
import DateInput from 'apps/community-tool-ui/src/targetingFormBuilder/DateInput';
import { formatDate } from 'apps/community-tool-ui/src/utils';
import { socket } from 'apps/community-tool-ui/src/socket';
import { useEffect, useState } from 'react';

export default function TargetSelectForm() {
  const { pagination } = usePagination();
  const router = useRouter();
  const { loading, setLoading } = useCommunityTargetingStore((state) => ({
    setLoading: state.setLoading,
    setTargetUUID: state.setTargetUUID,
    loading: state.loading,
  }));
  const addTargeting = useTargetingCreate();

  const { data: definitions } = useFieldDefinitionsList({
    ...pagination,
    perPage: FIELD_DEF_FETCH_LIMIT,
    isTargeting: true,
  });

  const { targetingQueries } = useTargetingFormStore();
  const { handleSubmit } = useForm();

  const FormSchema = z.object({
    location: z.string().min(1),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  function isQueryEmpty(): boolean {
    if (Object.keys(targetingQueries).length === 0) {
      return true;
    }

    for (let key in targetingQueries) {
      if (targetingQueries.hasOwnProperty(key)) {
        if (targetingQueries[key]) return false;
      }
    }

    return true;
  }

  const handleTargetFormSubmit = async (formData: ITargetingQueries) => {
    setLoading(true);
    if (targetingQueries.createdAt) {
      targetingQueries.createdAt = formatDate(targetingQueries.createdAt);
    }
    const payload = { ...formData, ...targetingQueries };
    await addTargeting.mutateAsync({
      filterOptions: [{ data: payload }],
    });
  };

  useEffect(() => {
    socket.on('targeting-completed', (targetUuid: string) => {
      setLoading(false);
      router.push(`/targeting/filters?targetUUID=${targetUuid}`);
    });

    return () => setLoading(false);
  }, [router, setLoading]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleTargetFormSubmit)}>
        <ScrollArea className="mx-2 h-[calc(100vh-220px)]">
          <div className="grid place-items-center w-auto">
            <DateInput />

            <MultiSelect
              fieldName="gender"
              placeholder="Gender"
              options={genderOptions}
            />

            <MultiSelect
              fieldName="internetStatus"
              placeholder="Internet Status"
              options={internetStatusOptions}
            />

            <MultiSelect
              fieldName="phoneStatus"
              placeholder="Phone Status"
              options={phoneStatusOptions}
            />

            <MultiSelect
              fieldName="bankedStatus"
              placeholder="Banked Status"
              options={bankedStatusOptions}
            />
          </div>
          {definitions?.data?.rows.map((definition: any, index: number) => {
            return (
              <div key={index} className="grid place-items-center w-auto">
                <TargetingFormBuilder formField={definition} />
              </div>
            );
          })}
        </ScrollArea>
        <div
          style={{ position: 'fixed', left: '14%', bottom: 30 }}
          className="mt-6 text-start"
        >
          <Button type="submit" disabled={loading || isQueryEmpty()}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
