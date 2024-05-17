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

import { FIELD_DEF_FETCH_LIMIT } from 'apps/community-tool-ui/src/constants/app.const';
import { MultiSelect } from 'apps/community-tool-ui/src/targetingFormBuilder/MultiSelect';
import {
  bankedStatusOptions,
  genderOptions,
  internetStatusOptions,
  phoneStatusOptions,
} from '../../../constants/targeting.const';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function TargetSelectForm() {
  const { pagination } = usePagination();
  const { loading, setLoading, setTargetUUID } = useCommunityTargetingStore(
    (state) => ({
      setLoading: state.setLoading,
      setTargetUUID: state.setTargetUUID,
      loading: state.loading,
    }),
  );
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
      console.log({ key });
      if (targetingQueries.hasOwnProperty(key)) {
        if (targetingQueries[key]) return false;
      }
    }

    return true;
  }

  const handleTargetFormSubmit = async (formData: ITargetingQueries) => {
    setLoading(true);
    const payload = { ...formData, ...targetingQueries };

    const getTargetInfo = await addTargeting.mutateAsync({
      filterOptions: [{ data: payload }],
    });
    setTargetUUID(getTargetInfo?.data?.uuid);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <Form {...form}>
      <ScrollArea className="mx-2 h-[calc(100vh-250px)]">
        <form onSubmit={handleSubmit(handleTargetFormSubmit)}>
          <div>
            <MultiSelectCheckBox
              defaultName="gender"
              defaultLabel="Gender"
              defaultOptions={genderOptions}
            />

            <MultiSelectCheckBox
              defaultName="internetStatus"
              defaultLabel="Internet Status"
              defaultOptions={internetStatusOptions}
            />

            <MultiSelectCheckBox
              defaultName="phoneStatus"
              defaultLabel="Phone Status"
              defaultOptions={phoneStatusOptions}
            />

            <MultiSelectCheckBox
              defaultName="bankedStatus"
              defaultLabel="Banked Status"
              defaultOptions={bankedStatusOptions}
            />

            {definitions?.data?.rows.map((definition: any, index: number) => {
              return (
                <div key={index} className="mt-3">
                  <TargetingFormBuilder formField={definition} />
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-end mr-2">
            <Button type="submit" disabled={!isMultiFieldEmpty()}>
              Submit
            </Button>
          </div>
        </form>
      </ScrollArea>
    </Form>
  );
}
