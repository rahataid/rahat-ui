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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TargetingFormBuilder from '../../targetingFormBuilder';
import { usePagination } from '@rahat-ui/query';
import { useFieldDefinitionsList } from '@rahat-ui/community-query';

import {
  BankedStatus,
  PhoneStatus,
  Gender,
  InternetStatus,
} from '@rahataid/community-tool-sdk/enums/';
import { ITargetingQueries } from '../../types/targeting';

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
    gender: z.string().toUpperCase().optional(),
    phoneStatus: z.string().toUpperCase().optional(),
    internetStatus: z.string().toUpperCase().optional(),
    bankedStatus: z.string().toUpperCase().optional(),
    location: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gender: Gender.UKNOWN,
      phoneStatus: PhoneStatus.UNKNOWN,
      internetStatus: InternetStatus.UNKNOWN,
      bankedStatus: BankedStatus.UNKNOWN,
      location: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div style={{ maxHeight: '60vh' }} className="m-2 overflow-y-auto">
          <FormField
            control={control}
            name="gender"
            render={({ field }) => {
              return (
                <div className="mb-4">
                  <Label>Gender</Label>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-60">
                          <SelectValue placeholder={`--Select Option--`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        <SelectItem value={Gender.OTHER}>Other</SelectItem>
                        <SelectItem value={Gender.UKNOWN}>Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </div>
              );
            }}
          />

          <FormField
            control={control}
            name="internetStatus"
            render={({ field }) => {
              return (
                <div className="mb-4">
                  <Label>Internet Status</Label>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-60">
                          <SelectValue placeholder={`--Select Option--`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={InternetStatus.HOME_INTERNET}>
                          Home Internet
                        </SelectItem>
                        <SelectItem value={InternetStatus.MOBILE_INTERNET}>
                          Mobile Internet
                        </SelectItem>
                        <SelectItem value={InternetStatus.NO_INTERNET}>
                          No Internet
                        </SelectItem>
                        <SelectItem value={InternetStatus.UNKNOWN}>
                          Unknown
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </div>
              );
            }}
          />

          <FormField
            control={control}
            name="phoneStatus"
            render={({ field }) => {
              return (
                <div className="mb-4">
                  <Label>Phone Status</Label>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-60">
                          <SelectValue placeholder={`--Select Option--`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PhoneStatus.SMART_PHONE}>
                          Smart Phone
                        </SelectItem>
                        <SelectItem value={PhoneStatus.FEATURE_PHONE}>
                          Feature Phone
                        </SelectItem>
                        <SelectItem value={PhoneStatus.NO_PHONE}>
                          No Phone
                        </SelectItem>
                        <SelectItem value={PhoneStatus.UNKNOWN}>
                          Unknown
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </div>
              );
            }}
          />

          <FormField
            control={control}
            name="bankedStatus"
            render={({ field }) => {
              return (
                <div className="mb-4">
                  <Label>Banked Status</Label>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-60">
                          <SelectValue placeholder={`--Select Option--`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BankedStatus.BANKED}>
                          Banked
                        </SelectItem>
                        <SelectItem value={BankedStatus.UNDER_BANKED}>
                          Under Banked
                        </SelectItem>
                        <SelectItem value={BankedStatus.UNBANKED}>
                          UnBanked
                        </SelectItem>
                        <SelectItem value={BankedStatus.UNKNOWN}>
                          Unknown
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </div>
              );
            }}
          />

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
