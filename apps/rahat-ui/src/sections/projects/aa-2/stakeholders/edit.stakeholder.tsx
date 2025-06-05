'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStakeholderDetails, useUpdateStakeholders } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { HeaderWithBack, Heading } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export default function EditStakeholders() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const stakeholdersId = params.stakeholdersId as UUID;
  const searchParams = useSearchParams();
  const stakeholder = useStakeholderDetails(projectId, {
    uuid: stakeholdersId,
  });
  const redirectTo = searchParams?.get('from');
  console.log(' stakeholders', stakeholder);
  const updateStakeholder = useUpdateStakeholders();

  const isValidPhoneNumberRefinement = (value: string | undefined) => {
    if (value === undefined || value === '') return true; // If phone number is empty or undefined, it's considered valid
    return isValidPhoneNumber(value);
  };

  const FormSchema = z.object({
    name: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter name.' }),
    phone: z.string().optional().refine(isValidPhoneNumberRefinement, {
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
      name: stakeholder?.name || '',
      phone: stakeholder?.phone || '',
      email: stakeholder?.email || '',
      designation: stakeholder?.designation || '',
      organization: stakeholder?.organization || '',
      district: stakeholder?.district || '',
      municipality: stakeholder?.municipality || '',
    },
  });

  useEffect(() => {
    if (stakeholder) {
      form.reset({
        name: stakeholder.name || '',
        phone: stakeholder.phone || '',
        email: stakeholder.email || '',
        designation: stakeholder.designation || '',
        organization: stakeholder.organization || '',
        district: stakeholder.district || '',
        municipality: stakeholder.municipality || '',
      });
    }
  }, [stakeholder, form]);

  const routeNav = redirectTo
    ? `/projects/aa/${projectId}/stakeholders?tab=stakeholders`
    : `/projects/aa/${projectId}/stakeholders/${stakeholdersId}`;
  const handleEditStakeholders = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updateStakeholder.mutateAsync({
        projectUUID: projectId,
        stakeholderPayload: { uuid: stakeholdersId, ...data },
      });
      router.push(routeNav);
      form.reset();
    } catch (e) {
      console.error('Error updating stakeholder', e);
    }
  };
  if (!stakeholder) {
    return (
      <div className="space-y-4 p-4 rounded-sm shadow border bg-card gap-3">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4 mb-4 mt-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="p-4">
      <HeaderWithBack
        title={'Edit Stakeholder'}
        subtitle="Fill the form below  to create a new stakeholder"
        path={routeNav}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditStakeholders)}>
          <div className="p-4 rounded-sm shadow border bg-card gap-3">
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

              {/* <FormField
                control={form.control}
                name="district"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        value={field.value || ''}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <Label>District</Label>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(DISTRICTS_OF_NEPAL).map(
                              (district) => (
                                <SelectItem value={district} key={district}>
                                  {district}
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              /> */}
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
              {/* <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        value={field.value || ''}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <Label>Municipality</Label>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a municipality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {MUNICIPALITIES_OF_NEPAL.map(
                              (municipality, index) => (
                                <SelectItem value={municipality} key={index}>
                                  {municipality}
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              /> */}
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
                className=" px-8"
                onClick={() =>
                  router.push(
                    `/projects/aa/${projectId}/stakeholders/${stakeholdersId}`,
                  )
                }
              >
                Cancel
              </Button>
              <Button className="w-32" disabled={form.formState.isSubmitting}>
                Update
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
