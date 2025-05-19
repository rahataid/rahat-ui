'use client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { isAddress } from 'viem';

import {
  useActiveFieldDefList,
  useCommunityBeneficiaryCreate,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import {
  BankedStatus,
  Gender,
  InternetStatus,
  PhoneStatus,
} from '@rahataid/community-tool-sdk/enums/';
import { FIELD_DEF_FETCH_LIMIT } from 'apps/community-tool-ui/src/constants/app.const';
import { format } from 'date-fns';
import { CalendarIcon, Wallet } from 'lucide-react';
import { useEffect } from 'react';
import { z } from 'zod';
import FormBuilder from '../../../formBuilder';
import useFormStore from '../../../formBuilder/form.store';
import {
  filterFieldDefs,
  formatDate,
  selectNonEmptyFields,
} from '../../../utils';

export default function AddBeneficiary() {
  const { extras }: any = useFormStore();

  const { pagination } = usePagination();
  const { data: definitions } = useActiveFieldDefList({
    ...pagination,
    perPage: FIELD_DEF_FETCH_LIMIT,
  });
  const addCommunityBeneficiary = useCommunityBeneficiaryCreate();
  const FormSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: 'FirstName must be at least 2 character' }),
    lastName: z
      .string()
      .min(2, { message: 'LastName must be at least 2 character' }),
    walletAddress: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          if (!isAddress(value)) return false;
          return true;
        },
        {
          message: 'Invalid wallet address',
        },
      ),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .refine((value) => !/\s/.test(value), {
        message: 'Phone must not contain whitespace',
      }),
    email: z.string().optional(),
    birthDate: z.date().optional(),
    location: z.string().optional().or(z.literal('')),
    latitude: z
      .number()
      .refine((val) => val >= -90 && val <= 90, {
        message: 'Latitude must be between -90 and 90',
      })
      .optional(),
    longitude: z
      .number()
      .refine((val) => val >= -180 && val <= 180, {
        message: 'Longitude must be between -180 and 180',
      })
      .optional(),
    notes: z.string().optional(),
    gender: z.string().toUpperCase().optional(),
    bankedStatus: z.string().toUpperCase().optional(),
    internetStatus: z.string().toUpperCase().optional(),
    phoneStatus: z.string().toUpperCase().optional(),
    govtIDNumber: z.string().optional(),
    govtIDType: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      walletAddress: '',
      phone: '',
      bankedStatus: '',
      internetStatus: '',
      phoneStatus: '',
      email: '',
      location: '',
      latitude: 0,
      longitude: 0,
      notes: '',
      govtIDNumber: '',
      govtIDType: '',
    },
  });

  const handleCreateBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    const formattedDate = formatDate(data.birthDate as Date);
    const formData = {
      ...data,
      birthDate: data.birthDate && formattedDate,
    };

    const nonEmptyFields = selectNonEmptyFields(formData);
    await addCommunityBeneficiary.mutateAsync({
      ...nonEmptyFields,
      extras,
    });
  };

  useEffect(() => {
    if (addCommunityBeneficiary.isSuccess) {
      form.reset();
    }
  }, [addCommunityBeneficiary.isSuccess, form]);

  const filteredDefinitions = filterFieldDefs(definitions);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
        <div className="p-4 h-add">
          <h1 className="text-lg font-semibold mb-6">Add Beneficiary</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div
              style={{ maxHeight: '70vh' }}
              className="grid grid-cols-2 gap-4 p-2 overflow-y-auto"
            >
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
                          step="any"
                          placeholder="Longitude"
                          onChange={(e) => {
                            const numericValue = parseFloat(e.target.value);
                            form.setValue('longitude', numericValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.longitude?.message}
                      </FormMessage>
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
                          step="any"
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
                              <span>Date of Birth</span>
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
                          captionLayout="dropdown"
                          fromYear={new Date().getFullYear() - 150}
                          toYear={new Date().getFullYear()}
                          classNames={{
                            caption_dropdowns: 'grid grid-cols-2',
                            dropdown_month: 'cols-span-1',
                            dropdown_year: 'cols-span-1',
                            vhidden: 'hidden',
                            dropdown_icon: 'hidden',
                            caption_label: 'hidden',
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="govtIDNumber"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Government ID Number"
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
              {filteredDefinitions && filteredDefinitions.length > 0 && (
                <h3>
                  <b>Extra Fields:</b>
                </h3>
              )}
              <br />
              {filteredDefinitions && filteredDefinitions.length > 0
                ? filteredDefinitions.map((definition: any) => {
                    console.log(definition);
                    return (
                      <>
                        <FormBuilder
                          key={definition.id}
                          formField={definition}
                        />
                      </>
                    );
                  })
                : 'No field definitions found!'}
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
