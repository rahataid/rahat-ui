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
import MultiSelectCheckBox from '../../../targetingFormBuilder/MultiSelectCheckBox';
import useTargetingFormStore from '../../../targetingFormBuilder/form.store';
import { ITargetingQueries } from '../../../types/targeting';

import {
  bankedStatusOptions,
  genderOptions,
  internetStatusOptions,
  phoneStatusOptions,
} from '../../../constants/targeting.const';

const FIELD_DEF_FETCH_LIMIT = 300;

// type IProps = {
//   onFormSubmit: (formData: ITargetingQueries) => Promise<void>;
// };

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

  const { handleSubmit, control } = useForm();

  const FormSchema = z.object({
    location: z.string().min(1),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: '',
    },
  });

  function isMultiFieldEmpty(): boolean {
    if (Object.keys(targetingQueries).length === 0) {
      return false;
    }
    for (const key in targetingQueries) {
      if (Object.prototype.hasOwnProperty.call(targetingQueries, key)) {
        if (targetingQueries[key] === '') {
          return false;
        }
        return true;
      }
      return false;
    }
    return true;
  }

  function isFormEmpty(): boolean {
    const formData = {
      ...form.getValues(),
      location: form.getValues('location'),
    };

    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const value = formData[key as keyof typeof formData];
        if (value === '') {
          return false;
        }
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
    </Form>
  );
}