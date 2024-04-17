import React, { useEffect } from 'react';
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
import { useTargetingCreate } from '@rahat-ui/community-query';

import {
  BankedStatus,
  PhoneStatus,
  Gender,
} from '@rahataid/community-tool-sdk/enums/';

export default function TargetSelectForm() {
  const addTargeting = useTargetingCreate();

  const { handleSubmit, control } = useForm();

  const FormSchema = z.object({
    ssa: z.string().optional(),
    vulnerability: z.string().toUpperCase().optional(),
    gender: z.string().toUpperCase().optional(),
    phoneStatus: z.string().toUpperCase().optional(),
    bankedStatus: z.string().toUpperCase().optional(),
    location: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ssa: 'Widowed',
      vulnerability: 'PREGNANT',
      gender: Gender.UKNOWN,
      phoneStatus: PhoneStatus.UNKNOWN,
      bankedStatus: BankedStatus.UNKNOWN,
      location: '',
    },
  });

  const handleTargetSubmit = async (data: z.infer<typeof FormSchema>) => {
    await addTargeting.mutateAsync({
      filterOptions: [data],
    });
  };

  useEffect(() => {
    if (addTargeting.isSuccess) {
      form.reset();
    }
  }, [addTargeting.isSuccess, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleTargetSubmit)}>
        <div className="m-2">
          <FormField
            control={control}
            name="ssa"
            render={({ field }) => {
              return (
                <div className="mb-2">
                  <Label>SSA</Label>
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select SSA`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'Old_Citizen'}>
                          Old Citizen
                        </SelectItem>
                        <SelectItem value={'Widowed'}>Widowed</SelectItem>
                        <SelectItem value={'Children_under_5_dalit'}>
                          Childern under 5 (Dalit)
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
            name="vulnerability"
            render={({ field }) => {
              return (
                <div className="mb-2">
                  <Label>Vulnerability</Label>
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select Vulnerability`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'PREGNANT'}>Pregnant</SelectItem>
                        <SelectItem value={'LACTATING'}>Lactating</SelectItem>
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
            name="gender"
            render={({ field }) => {
              return (
                <div className="mb-2">
                  <Label>Gender</Label>
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select Gender`} />
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
            name="phoneStatus"
            render={({ field }) => {
              return (
                <div className="mb-2">
                  <Label>Phone Status</Label>
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select Phone Status`} />
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
                <div className="mb-2">
                  <Label>Banked Status</Label>
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select Banked Status`} />
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
                      <Input type="text" placeholder="Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              );
            }}
          />
          <div className="mt-4">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
