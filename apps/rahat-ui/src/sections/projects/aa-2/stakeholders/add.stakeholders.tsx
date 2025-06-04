import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UUID } from 'crypto';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { DISTRICTS_OF_NEPAL } from 'apps/rahat-ui/src/common/data/district';
import { MUNICIPALITIES_OF_NEPAL } from 'apps/rahat-ui/src/common/data/municipality';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useCreateStakeholders } from '@rahat-ui/query';

export default function AddStakeholders() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const addedFromGroup = searchParams.get('fromGroup');
  const createStakeholder = useCreateStakeholders();

  const isValidPhoneNumberRefinement = (value: string | undefined) => {
    if (value === undefined || value === '') return true; // If phone number is empty or undefined, it's considered valid
    return isValidPhoneNumber(value);
  };

  const FormSchema = z.object({
    name: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter name.' }),
    phone: z.string().refine(isValidPhoneNumberRefinement, {
      message: 'Invalid phone number',
    }),
    email: z
      .string()
      .optional()
      .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: 'Invalid email address',
      }),
    designation: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter designation.' }),
    organization: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter organization.' }),
    district: z.string().min(2, { message: 'Please enter district.' }),
    municipality: z.string().min(2, { message: 'Please enter municipality' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '+977',
      email: '',
      designation: '',
      organization: '',
      district: '',
      municipality: '',
    },
  });

  const handleCreateStakeholders = async (data: z.infer<typeof FormSchema>) => {
    try {
      await createStakeholder.mutateAsync({
        projectUUID: id as UUID,
        stakeholderPayload: data,
      });
      router.push(`/projects/aa/${id}/stakeholders`);
      form.reset();
    } catch (e) {
      console.error('Create Stakeholder Error::', e);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={'Add Stakeholder'}
          subtitle="Fill the form below  to create a new stakeholder"
          path={`/projects/aa/${id}/stakeholders`}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateStakeholders)}>
          <div className=" p-4 rounded-lg border bg-card gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label>Stakeholders Name</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter a Stakeholder Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="grid grid-cols-2 gap-4 mb-4 mt-5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Phone Number</Label>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="NP"
                          placeholder="Enter a Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter a Email Address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Designation</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Designation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Organization</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter an Organization"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>District</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a District"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Municipality</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Municipality"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                className=" px-8 "
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button className="w-32" disabled={form.formState.isSubmitting}>
                Add
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
