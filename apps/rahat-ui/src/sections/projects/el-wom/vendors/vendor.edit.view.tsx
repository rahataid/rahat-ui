'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import { Loader2, Wallet } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { UUID } from 'crypto';
import { Gender } from '@rahataid/sdk/enums';
import { useGetVendor, useUpdateVendor } from '@rahat-ui/query';
import HeaderWithBack from '../../components/header.with.back';

export default function EditVendors() {
  const router = useRouter();
  const { id, venId } = useParams() as { id: UUID; venId: UUID };

  const { data: vendorDetails, isLoading } = useGetVendor(venId);
  const vendor = React.useMemo(() => {
    return vendorDetails?.data;
  }, [vendorDetails]);

  const updateVendor = useUpdateVendor();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    wallet: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    email: z.string().optional(),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Gender' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      wallet: '',
      email: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor?.name?.toString(),
        gender: vendor?.gender?.toString(),
        email: vendor?.email?.toString(),
        phone: vendor?.phone?.toString(),
        wallet: vendor?.wallet?.toString(),
      });
    }
  }, [vendor, form.reset]);

  const handleEditVendor = async (data: z.infer<typeof FormSchema>) => {
    await updateVendor.mutateAsync({
      uuid: venId,
      payload: { ...data },
    });
    router.push(`/projects/el-kenya/${id}/vendors`);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditVendor)}>
          <div className="p-4 h-[calc(100vh-115px)]">
            <HeaderWithBack
              title="Edit Vendor"
              subtitle="Edit Vendor Detail"
              path={`/projects/el-kenya/${id}/vendors`}
            />
            <div className="shadow-md p-4 rounded-sm bg-card">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Vendor Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter vendor name"
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.MALE} />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.FEMALE} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.OTHER} />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="UNKNOWN" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Unknown
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            placeholder="Enter phone number"
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="wallet"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Wallet Address</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Enter wallet address"
                              {...field}
                            />
                            <p className="text-xs text-amber-500 mt-2">
                              * Wallet address is required. If not entered, it
                              will be automatically filled.
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 py-2 px-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/vendors')}
            >
              Cancel
            </Button>
            {updateVendor.isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="px-10">Save Changes</Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
