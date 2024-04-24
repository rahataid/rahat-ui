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

import {
  BankedStatus,
  InternetStatus,
  PhoneStatus,
} from '@rahataid/community-tool-sdk/enums/';
import { z } from 'zod';

import {
  useCommunityBeneficiaryUpdate,
  useFieldDefinitionsList,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { Gender } from '@rumsan/sdk/enums';
import { Wallet } from 'lucide-react';
import FormBuilder from '../../formBuilder';

import useFormStore from '../../formBuilder/form.store';
import { UUID } from 'crypto';
import { indexOf } from 'lodash';

const FIELD_DEF_FETCH_LIMIT = 200;

export default function EditBeneficiary({ data }: { data: ListBeneficiary }) {
  const { extras }: any = useFormStore();

  const updateBeneficiaryClient = useCommunityBeneficiaryUpdate();
  const { pagination } = usePagination();
  const { data: definitions } = useFieldDefinitionsList({
    ...pagination,
    perPage: FIELD_DEF_FETCH_LIMIT,
  });

  const FormSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: 'FirstName must be at least 4 character' }),
    lastName: z
      .string()
      .min(2, { message: 'LastName must be at least 4 character' }),
    walletAddress: z.string().optional(),
    gender: z.string().toUpperCase().optional(),
    email: z.string().optional(),
    phone: z.string(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    notes: z.string().optional(),

    bankedStatus: z.string().toUpperCase().optional(),
    internetStatus: z.string().toUpperCase().optional(),
    phoneStatus: z.string().toUpperCase().optional(),

    govtIDType: z.string().optional(),
    govtIDNumber: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      walletAddress: data?.walletAddress || '',
      firstName: data?.firstName,
      lastName: data?.lastName,
      gender: data?.gender,
      email: data?.email || '',
      phone: data?.phone || '',
      bankedStatus: data?.bankedStatus || '',
      internetStatus: data?.internetStatus || '',
      phoneStatus: data?.phoneStatus || '',
      location: data?.location || '',
      latitude: data?.latitude || 0,
      longitude: data?.longitude || 0,
      notes: data?.notes || '',
      govtIDNumber: data?.govtIDNumber || '',
    },
  });

  const handleEditBeneficiary = async (
    formData: z.infer<typeof FormSchema>,
  ) => {
    const nonEmptyFields: any = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        nonEmptyFields[key] = value;
      }
    });

    await updateBeneficiaryClient.mutateAsync({
      uuid: data.uuid as UUID,
      payload: {
        ...nonEmptyFields,
        extras,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
        <div className="p-4 h-add">
          {/* <h1 className="text-lg font-semibold mb-6">Basic Details</h1> */}
          <div
            style={{ maxHeight: '62vh' }}
            className="grid grid-cols-2 gap-4 mb- overflow-y-auto"
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
                          onChange={(e) => {
                            form.setValue('walletAddress', e.target.value);
                          }}
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
                    <Label className="text-xs font-medium">First Name</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="First Name"
                        {...field}
                        onChange={(e) => {
                          form.setValue('firstName', e.target.value);
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
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Last Name</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        {...field}
                        onChange={(e) => {
                          form.setValue('lastName', e.target.value);
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
              name="gender"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Gender</Label>
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
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Email</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Email"
                        {...field}
                        onChange={(e) => {
                          form.setValue('email', e.target.value);
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
              name="phoneStatus"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Phone Status</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Phone Status" />
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
              name="phone"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Phone</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Phone"
                        {...field}
                        onChange={(e) => {
                          form.setValue('phone', e.target.value);
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
              name="internetStatus"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">
                      Internet Status
                    </Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Internet Status" />
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
              name="bankedStatus"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Banked Status</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Banked Status" />
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
              name="govtIDNumber"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">
                      Government ID Number
                    </Label>

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
              name="location"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Location</Label>

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
              name="latitude"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Latitude</Label>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Latitude"
                        {...field}
                        onChange={(e) => {
                          let numericValue = parseFloat(e.target.value);
                          if (isNaN(numericValue)) {
                            numericValue = 0;
                          }
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
              name="longitude"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label className="text-xs font-medium">Longitude</Label>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Longitude"
                        {...field}
                        onChange={(e) => {
                          let numericValue = parseFloat(e.target.value);
                          if (isNaN(numericValue)) {
                            numericValue = 0;
                          }
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-xs font-medium">Notes</Label>
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
            <h3>Extra Fields</h3> <br />
            {definitions?.data?.rows.map((definition: any, index: number) => {
              return <FormBuilder key={index} formField={definition} />;
            }) || 'No field definitions found!'}
          </div>

          <div className="flex justify-end mt-5">
            <Button>Update Beneficiary</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
