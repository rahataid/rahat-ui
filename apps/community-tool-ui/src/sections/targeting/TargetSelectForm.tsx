import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useForm } from 'react-hook-form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TargetingFormBuilder from '../../targetingFormBuilder';
import { usePagination } from '@rahat-ui/query';
import { useFieldDefinitionsList } from '@rahat-ui/community-query';
import { ITargetingQueries } from '../../types/targeting';
import MultiSelectCheckBox from '../../targetingFormBuilder/MultiSelectCheckBox';
import {
  bankedStatusOptions,
  genderOptions,
  internetStatusOptions,
  phoneStatusOptions,
} from '../../constants/targeting.const';

const FIELD_DEF_FETCH_LIMIT = 200;

type IProps = {
  onFormSubmit: (formData: ITargetingQueries) => Promise<void>;
};

export default function TargetSelectForm({ onFormSubmit }: IProps) {
  const { pagination } = usePagination();
  const { data: definitions } = useFieldDefinitionsList({
    ...pagination,
    perPage: FIELD_DEF_FETCH_LIMIT,
    isTargeting: true,
  });

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

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div style={{ maxHeight: '60vh' }} className="m-2 overflow-y-auto">
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
          <div className="mt-3">
            <FormField
              control={control}
              name="location"
              render={({ field }) => {
                return (
                  <>
                    <Label>Location</Label>
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Location"
                          defaultValue={field.value}
                          className="w-60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                );
              }}
            />
          </div>

          {definitions?.data?.rows.map((definition: any, index: number) => {
            return (
              <div key={index} className="mt-3">
                <TargetingFormBuilder formField={definition} />
              </div>
            );
          }) || 'No field definitions found!'}
        </div>
        <div className="mt-6">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
