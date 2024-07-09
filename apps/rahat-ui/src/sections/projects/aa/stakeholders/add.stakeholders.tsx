import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { isValidPhoneNumber } from 'react-phone-number-input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { useCreateStakeholders } from '@rahat-ui/query';
import { UUID } from 'crypto';

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
      .regex(/^[A-Za-z\s]*$/, 'Only only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter name.' }),
    phone: z.string().optional().refine(isValidPhoneNumberRefinement, {
      message: 'Invalid phone number',
    }),
    email: z.string().optional(),
    designation: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter designation.' }),
    organization: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter organization.' }),
    district: z.string().min(2, { message: 'Please enter district.' }),
    municipality: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only only alphabetic characters are allowed.')

      .min(2, { message: 'Please enter municipality' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
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
      if (addedFromGroup == 'true') {
        router.push(`/projects/aa/${id}/groups/add`);
      } else router.push(`/projects/aa/${id}/stakeholders`);
    } catch (e) {
      console.error('Create Stakeholder Error::', e);
    }
  };

  React.useEffect(() => {
    if (createStakeholder.isSuccess) {
      form.reset();
    }
  }, [createStakeholder.isSuccess]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateStakeholders)}>
        <div className="p-4 h-add bg-card">
          <h1 className="text-lg font-semibold mb-6">Add : Stakeholders</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <PhoneInput placeholder="Phone" {...field} />
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
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
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
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Designation"
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
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Organization"
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
                      <FormControl>
                        <Input type="text" placeholder="District" {...field} />
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
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Municipality"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button>Create Stakeholders</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
