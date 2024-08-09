'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useForm } from 'react-hook-form';
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
import { z } from 'zod';
import { useUpdateBeneficiary } from '@rahat-ui/query';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function EditBeneficiary({ beneficiary }: any) {
  const { closeSecondPanel } = useSecondPanel();
  const updateBeneficiary = useUpdateBeneficiary();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    walletAddress: z
      .string()
      .min(42, { message: 'The Ethereum address must be 42 characters long' }),
    phone: z.string(),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Gender' }),
    bankedStatus: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Bank Status' }),
    internetStatus: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select Internet Status' }),
    phoneStatus: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select Phone Status' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: beneficiary?.piiData?.name,
      phone: beneficiary?.piiData?.phone,
      gender: beneficiary?.gender,
      walletAddress: beneficiary?.walletAddress,
      bankedStatus: beneficiary?.bankedStatus,
      internetStatus: beneficiary?.internetStatus,
      phoneStatus: beneficiary?.phoneStatus,
    },
  });

  const handleEditBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updateBeneficiary.mutateAsync({
        id: beneficiary.id,
        uuid: beneficiary.uuid,
        gender: data.gender,
        bankedStatus: data.bankedStatus,
        internetStatus: data.internetStatus,
        phoneStatus: data.phoneStatus,
        piiData: {
          name: data.name,
          phone: data.phone,
        },
        walletAddress: data.walletAddress,
      });
    } catch (e) {
      console.error('Error::', e);
    }
  };

  useEffect(() => {
    updateBeneficiary.isSuccess && closeSecondPanel();
  }, [updateBeneficiary]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
        <div className="p-4">
          <h1 className="text-md font-semibold mb-6">Edit Beneficiary</h1>
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
              name="walletAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Wallet Address"
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
                          <SelectValue placeholder="Banked Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BANKED">Banked</SelectItem>
                        <SelectItem value="UNDER_BANKED">
                          Under Banked
                        </SelectItem>
                        <SelectItem value="UNBANKED">UnBanked</SelectItem>
                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
                          <SelectValue placeholder="Internet Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MOBILE_INTERNET">
                          Mobile Internet
                        </SelectItem>
                        <SelectItem value="NO_INTERNET">No Internet</SelectItem>
                        <SelectItem value="HOME_INTERNET">
                          Home Internet
                        </SelectItem>
                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
                          <SelectValue placeholder="Phone Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SMART_PHONE">Smart Phone</SelectItem>
                        <SelectItem value="NO_PHONE">No Phone</SelectItem>
                        <SelectItem value="FEATURE_PHONE">
                          Feature Phone
                        </SelectItem>
                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button>Update Beneficiary</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
