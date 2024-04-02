'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { z } from 'zod';
import { CalendarIcon, Check, ChevronsUpDown, Wallet } from 'lucide-react';
import {
  BankedStatus,
  Gender,
  InternetStatus,
  PhoneStatus,
} from '@rahataid/community-tool-sdk/enums/';
import React, { useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useCommunityBeneficiaryCreate } from '@rahat-ui/community-query';

export default function AddBeneficiary() {
  const addCommunityBeneficiary = useCommunityBeneficiaryCreate();
  const FormSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: 'FirstName must be at least 4 character' }),
    lastName: z
      .string()
      .min(2, { message: 'LastName must be at least 4 character' }),
    walletAddress: z
      .string()
      .min(42, { message: 'The Ethereum address must be 42 characters long' }),
    phone: z.string(),
    email: z.string().email().optional(),
    birthDate: z.date().optional(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    notes: z.string().optional(),
    gender: z.string().toUpperCase().optional(),
    bankedStatus: z.string().toUpperCase().optional(),
    internetStatus: z.string().toUpperCase().optional(),
    phoneStatus: z.string().toUpperCase().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: Gender.UKNOWN,
      walletAddress: '',
      phone: '',
      bankedStatus: BankedStatus.UNKNOWN,
      internetStatus: InternetStatus.UNKNOWN,
      phoneStatus: PhoneStatus.UNKNOWN,
      email: '',
      location: '',
      latitude: 0,
      longitude: 0,
      notes: '',
    },
  });

  const handleCreateBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    await addCommunityBeneficiary.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender as Gender,
      walletAddress: data.walletAddress,
      phone: data.phone,
      bankedStatus: data.bankedStatus as BankedStatus,
      internetStatus: data.internetStatus as InternetStatus,
      phoneStatus: data.phoneStatus as PhoneStatus,
      email: data.email,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      notes: data.notes,
    });
  };

  useEffect(() => {
    if (addCommunityBeneficiary.isSuccess) {
      form.reset();
    }
  }, [addCommunityBeneficiary.isSuccess, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
        <div className="p-4 h-add">
          <h1 className="text-lg font-semibold mb-6">Add Beneficiary</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <div className="relative w-full">
                          <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Wallet Address"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="First Name"
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
                name="lastName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Last Name" {...field} />
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
                        <Input type="text" placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="bankedStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder=" Select Banked Status" />
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
                  );
                }}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
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
                  );
                }}
              />
              <FormField
                control={form.control}
                name="internetStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Internet Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={InternetStatus.MOBILE_INTERNET}>
                            Mobile Internet
                          </SelectItem>
                          <SelectItem value={InternetStatus.NO_INTERNET}>
                            No Internet
                          </SelectItem>
                          <SelectItem value={InternetStatus.HOME_INTERNET}>
                            Home Internet
                          </SelectItem>
                          <SelectItem value={InternetStatus.UNKNOWN}>
                            Unknown
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phoneStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select  Phone Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PhoneStatus.SMART_PHONE}>
                            Smart Phone
                          </SelectItem>
                          <SelectItem value={PhoneStatus.NO_PHONE}>
                            No Phone
                          </SelectItem>
                          <SelectItem value={PhoneStatus.FEATURE_PHONE}>
                            Feature Phone
                          </SelectItem>
                          <SelectItem value={PhoneStatus.UNKNOWN}>
                            Unknown
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Longitude"
                          onChange={(e) => {
                            const numericValue = parseFloat(e.target.value);
                            form.setValue('longitude', numericValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Latitude"
                          onChange={(e) => {
                            const numericValue = parseFloat(e.target.value);
                            form.setValue('latitude', numericValue);
                          }}
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
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={'outline'}>
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Birth Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button>Create Beneficiary</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
