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

export default function TargetSelectForm() {
  const { pagination } = usePagination();
  const { setLoading, setTargetUUID } = useCommunityTargetingStore((state) => ({
    setLoading: state.setLoading,
    setTargetUUID: state.setTargetUUID,
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
    }, 3000);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleTargetFormSubmit)}>
        <div style={{ maxHeight: '55vh' }} className="m-2 overflow-y-auto">
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

          {definitions?.data?.rows.map((definition: any, index: number) => {
            return (
              <div key={index} className="mt-3">
                <TargetingFormBuilder formField={definition} />
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-end mr-2">
          <Button type="submit" disabled={isQueryEmpty()}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
