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
import { toast } from 'react-toastify';

import { z } from 'zod';
import {
  BankedStatus,
  InternetStatus,
  PhoneStatus,
} from '@rahataid/community-tool-sdk/enums/';
import React, { useEffect } from 'react';

import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { useCommunityBeneficiaryUpdate } from '@rahat-ui/community-query';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { ID_TYPE } from '../../constants/beneficiary.const';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';

export default function EditBeneficiary({ data }: { data: ListBeneficiary }) {
  const updateBeneficiaryClient = useCommunityBeneficiaryUpdate();

  const FormSchema = z.object({
    phone: z.string(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    notes: z.string().optional(),

    bankedStatus: z.string().toUpperCase().optional(),
    internetStatus: z.string().toUpperCase().optional(),
    phoneStatus: z.string().toUpperCase().optional(),

    isVulnerable: z.boolean().optional(),
    govtIDType: z.string().optional(),
    govtIDNumber: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: data?.phone || '',
      bankedStatus: data?.bankedStatus || '',
      internetStatus: data?.internetStatus || '',
      phoneStatus: data?.phoneStatus || '',
      location: data?.location || '',
      latitude: data?.latitude || 0,
      longitude: data?.longitude || 0,
      notes: data?.notes || '',
      isVulnerable: data?.isVulnerable || false,
      govtIDType: data?.govtIDType || '',
      govtIDNumber: data?.govtIDNumber || '',
    },
  });

  const handleEditBeneficiary = async (
    formData: z.infer<typeof FormSchema>,
  ) => {
    await updateBeneficiaryClient.mutateAsync({
      uuid: data.uuid,
      payload: {
        firstName: data?.firstName,
        lastName: data?.lastName,
        phone: formData.phone,
        bankedStatus: formData.bankedStatus as BankedStatus,
        internetStatus: formData.internetStatus as InternetStatus,
        phoneStatus: formData.phoneStatus as PhoneStatus,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        notes: formData.notes,
        isVulnerable: formData.isVulnerable,
        govtIDType: formData.govtIDType,
        govtIDNumber: formData.govtIDNumber,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
        <div className="p-4 h-add">
          <h1 className="text-lg font-semibold mb-6">Update Beneficiary</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                name="bankedStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label className="text-xs font-medium">
                        Banked Status
                      </Label>
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
                name="phoneStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label className="text-xs font-medium">
                        Phone Status
                      </Label>
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
                      <Label className="text-xs font-medium">Latitude</Label>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Latitude"
                          {...field}
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
                name="govtIDType"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label className="text-xs font-medium">
                        Government Id Type
                      </Label>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Government ID Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ID_TYPE.CITIZZENSHIP}>
                            Citizenship
                          </SelectItem>
                          <SelectItem value={ID_TYPE.DRIVING_LICENSE}>
                            Driving License
                          </SelectItem>
                          <SelectItem value={ID_TYPE.PASSPORT}>
                            Passport
                          </SelectItem>
                          <SelectItem value={ID_TYPE.NATIONAL_ID_NUMBER}>
                            National ID
                          </SelectItem>
                          <SelectItem value={ID_TYPE.OTHER}>Other</SelectItem>
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
                        Government Id Number
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
                name="isVulnerable"
                render={({ field }) => (
                  <div className="flex flex-col justify-evenly items-center">
                    <Label> Vulnerable</Label>
                    <Switch
                      {...field}
                      value={field.value ? 'false' : 'true'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
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
            </div>
            <div className="flex justify-end">
              <Button>Update Beneficiary</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
